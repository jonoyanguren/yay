import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { RESERVATION_PAYMENT_CENTS } from "@/lib/stripe-config";
import { sendMetaLeadEvent } from "@/lib/meta-conversions";
import { getRoomTypeAvailability } from "@/lib/retreat-capacity";
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
  retreatId: string;
  slug: string;
  roomTypeId: string;
  roomQuantity: number;
  extras: { id: string; quantity: number }[];
  customerEmail: string;
  customerName: string | null;
  customerPhone: string;
};

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe no configurado" },
      { status: 500 }
    );
  }

  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  const {
    retreatId,
    slug,
    roomTypeId,
    roomQuantity,
    extras,
    customerEmail,
    customerName,
    customerPhone,
  } = body;
  const retreat = await prisma.retreat.findFirst({
    where: { id: retreatId, published: true, hideFromWeb: false },
  });
  if (!retreat) {
    return NextResponse.json({ error: "Retiro no encontrado" }, { status: 404 });
  }
  const retreatReservationDepositCents = Number(
    (retreat as Record<string, unknown>).reservationDepositCents ??
      RESERVATION_PAYMENT_CENTS,
  );
  const retreatChargeFullAmount = Boolean(
    (retreat as Record<string, unknown>).chargeFullAmount ?? false,
  );


  if (
    !retreatId ||
    !slug ||
    !roomTypeId ||
    roomQuantity == null ||
    roomQuantity < 1 ||
    !customerEmail?.trim() ||
    !customerPhone?.trim()
  ) {
    return NextResponse.json(
      {
        error:
          "Faltan datos requeridos (retiro, habitación, email y teléfono)",
      },
      { status: 400 }
    );
  }

  const phoneNormalized = normalizeCustomerPhone(customerPhone);
  const emailNormalized = normalizeCustomerEmail(customerEmail);
  if (!isValidBookingEmail(emailNormalized)) {
    return NextResponse.json(
      { error: BOOKING_EMAIL_INVALID_MESSAGE },
      { status: 400 },
    );
  }

  if (!isValidBookingPhone(phoneNormalized)) {
    return NextResponse.json({ error: BOOKING_PHONE_INVALID_MESSAGE }, { status: 400 });
  }

  const roomType = await prisma.retreatRoomType.findFirst({
    where: { id: roomTypeId, retreatId },
    select: { id: true, name: true, priceCents: true },
  });
  if (!roomType) {
    return NextResponse.json(
      { error: "Tipo de habitación no válido para este retiro" },
      { status: 400 }
    );
  }

  const roomAvailability = await getRoomTypeAvailability(roomType.id);
  const roomAvailable = roomAvailability?.available ?? 0;
  if (roomQuantity > roomAvailable) {
    return NextResponse.json(
      { error: "Esta habitacion ya no tiene plazas disponibles" },
      { status: 400 },
    );
  }

  const requestedExtras = (extras ?? []).filter((e) => e.quantity > 0);
  const extraIds = requestedExtras.map((e) => e.id);
  const validExtras = new Map<string, { priceCents: number }>();
  if (extraIds.length > 0) {
    const extraRows = await prisma.retreatExtraActivity.findMany({
      where: { retreatId, id: { in: extraIds } },
      select: { id: true, priceCents: true },
    });
    extraRows.forEach((r) => validExtras.set(r.id, { priceCents: r.priceCents }));
  }

  const estimatedRoomTotalCents = roomType.priceCents * roomQuantity;
  const estimatedExtrasTotalCents = requestedExtras.reduce((sum, e) => {
    const extra = validExtras.get(e.id);
    if (!extra) return sum;
    return sum + extra.priceCents * e.quantity;
  }, 0);
  const estimatedTotalCents = estimatedRoomTotalCents + estimatedExtrasTotalCents;
  const reservationChargeCents = retreatChargeFullAmount
    ? estimatedTotalCents
    : Math.min(retreatReservationDepositCents, estimatedTotalCents);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: reservationChargeCents,
        product_data: {
          name: retreatChargeFullAmount ? "Pago completo" : "Reserva (señal)",
        },
      },
    },
  ];

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      retreatId,
      stripeSessionId: null,
      customerEmail: emailNormalized,
      customerName: customerName?.trim() || null,
      customerPhone: phoneNormalized,
      status: "pending",
    },
  });
  const bookingId = booking.id;

  // Add room slots
  await prisma.bookingRoomSlot.create({
    data: {
      bookingId,
      retreatRoomTypeId: roomTypeId,
      quantity: roomQuantity,
    },
  });

  // Add extras
  const extraData = requestedExtras
    .filter((e) => validExtras.has(e.id))
    .map((e) => ({
      bookingId,
      retreatExtraActivityId: e.id,
      quantity: e.quantity,
    }));
  if (extraData.length > 0) {
    await prisma.bookingExtra.createMany({ data: extraData });
  }

  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_creation: "always",
    customer_email: emailNormalized,
    metadata: {
      bookingId,
      paymentType: retreatChargeFullAmount ? "full_payment" : "reservation_fee",
      chargeMode: retreatChargeFullAmount ? "full" : "deposit",
      reservationAmountCents: String(reservationChargeCents),
      reservationDepositCents: String(retreatReservationDepositCents),
      estimatedTotalCents: String(estimatedTotalCents),
      customerPhone: phoneNormalized.slice(0, 500),
    },
    success_url: `${baseUrl}/retreats/${slug}/book/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/retreats/${slug}/book`,
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { stripeSessionId: session.id },
  });

  const clientIpAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;
  const clientUserAgent = request.headers.get("user-agent") ?? undefined;

  await sendMetaLeadEvent({
    bookingId,
    retreatId,
    reservationAmountCents: reservationChargeCents,
    customerEmail: emailNormalized,
    customerName: customerName?.trim() || null,
    clientIpAddress,
    clientUserAgent,
  });

  return NextResponse.json({ url: session.url });
}
