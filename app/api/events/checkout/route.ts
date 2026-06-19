import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getEventCapacity } from "@/lib/event-capacity";
import { sendMetaLeadEvent } from "@/lib/meta-conversions";
import {
  BOOKING_EMAIL_INVALID_MESSAGE,
  isValidBookingEmail,
  normalizeCustomerEmail,
} from "@/lib/booking-email";
import {
  BOOKING_PHONE_INVALID_MESSAGE,
  isValidBookingPhone,
  normalizeCustomerPhone,
} from "@/lib/booking-phone";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckoutBody = {
  eventId: string;
  slug: string;
  customerEmail: string;
  customerName: string | null;
  customerPhone: string;
};

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe no configurado" }, { status: 500 });
  }

  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  const { eventId, slug, customerEmail, customerName, customerPhone } = body;

  if (!eventId || !slug || !customerEmail?.trim() || !customerPhone?.trim()) {
    return NextResponse.json(
      { error: "Faltan datos requeridos (evento, email y teléfono)" },
      { status: 400 },
    );
  }

  const emailNormalized = normalizeCustomerEmail(customerEmail);
  if (!isValidBookingEmail(emailNormalized)) {
    return NextResponse.json(
      { error: BOOKING_EMAIL_INVALID_MESSAGE },
      { status: 400 },
    );
  }

  const phoneNormalized = normalizeCustomerPhone(customerPhone);
  if (!isValidBookingPhone(phoneNormalized)) {
    return NextResponse.json(
      { error: BOOKING_PHONE_INVALID_MESSAGE },
      { status: 400 },
    );
  }

  const event = await prisma.event.findFirst({
    where: { id: eventId, slug, published: true, hideFromWeb: false },
  });
  if (!event) {
    return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  }

  const { isSoldOut } = await getEventCapacity(event.id);
  if (isSoldOut) {
    return NextResponse.json(
      { error: "Este evento ya no tiene plazas disponibles" },
      { status: 400 },
    );
  }

  const registration = await prisma.eventRegistration.create({
    data: {
      eventId: event.id,
      customerEmail: emailNormalized,
      customerName: customerName?.trim() || null,
      customerPhone: phoneNormalized,
      status: "pending",
    },
  });

  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: event.priceCents,
          product_data: {
            name: event.title,
          },
        },
      },
    ],
    customer_creation: "always",
    customer_email: emailNormalized,
    metadata: {
      type: "event",
      registrationId: registration.id,
      eventId: event.id,
      customerPhone: phoneNormalized.slice(0, 500),
    },
    success_url: `${baseUrl}/events/${slug}/book/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/events/${slug}/book`,
  });

  await prisma.eventRegistration.update({
    where: { id: registration.id },
    data: { stripeSessionId: session.id },
  });

  const clientIpAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;
  const clientUserAgent = request.headers.get("user-agent") ?? undefined;

  await sendMetaLeadEvent({
    bookingId: registration.id,
    retreatId: event.id,
    reservationAmountCents: event.priceCents,
    customerEmail: emailNormalized,
    customerName: customerName?.trim() || null,
    clientIpAddress,
    clientUserAgent,
  });

  return NextResponse.json({ url: session.url });
}
