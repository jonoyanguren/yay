import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckoutBody = {
  retreatId: string;
  slug: string;
  roomTypeId: string;
  roomQuantity: number;
  extras: { id: string; quantity: number }[];
  customerEmail: string;
  customerName: string | null;
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
  } = body;

  if (
    !retreatId ||
    !slug ||
    !roomTypeId ||
    roomQuantity == null ||
    roomQuantity < 1 ||
    !customerEmail?.trim()
  ) {
    return NextResponse.json(
      { error: "Faltan datos requeridos (retiro, habitación, email)" },
      { status: 400 }
    );
  }

  // Check availability
  const availabilityRows = await prisma.$queryRaw<{ max_quantity: number; sold: string }[]>`
    SELECT r.max_quantity,
           COALESCE(SUM(brs.quantity) FILTER (WHERE b.status = 'paid'), 0)::text AS sold
    FROM retreat_room_types r
    LEFT JOIN booking_room_slots brs ON brs.retreat_room_type_id = r.id
    LEFT JOIN bookings b ON b.id = brs.booking_id
    WHERE r.id = ${roomTypeId}
    GROUP BY r.id, r.max_quantity
    LIMIT 1
  `;
  if (!availabilityRows[0]) {
    return NextResponse.json(
      { error: "Tipo de habitación no encontrado" },
      { status: 404 }
    );
  }
  const sold = parseInt(availabilityRows[0].sold, 10);
  const available = Math.max(0, availabilityRows[0].max_quantity - sold);
  
  if (roomQuantity > available) {
    return NextResponse.json(
      { error: "No hay suficientes plazas disponibles para esa habitación" },
      { status: 400 }
    );
  }

  const roomType = await prisma.retreatRoomType.findFirst({
    where: { id: roomTypeId, retreatId },
    select: { name: true, priceCents: true },
  });
  if (!roomType) {
    return NextResponse.json(
      { error: "Tipo de habitación no válido para este retiro" },
      { status: 400 }
    );
  }

  const extraIds = (extras ?? []).filter((e) => e.quantity > 0).map((e) => e.id);
  const extraMap = new Map<string, { name: string; price_cents: number }>();
  if (extraIds.length > 0) {
    const extraRows = await prisma.retreatExtraActivity.findMany({
      where: { retreatId, id: { in: extraIds } },
      select: { id: true, name: true, priceCents: true },
    });
    extraRows.forEach((r) =>
      extraMap.set(r.id, { name: r.name, price_cents: r.priceCents })
    );
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      quantity: roomQuantity,
      price_data: {
        currency: "eur",
        unit_amount: roomType.priceCents,
        product_data: { name: roomType.name },
      },
    },
  ];
  for (const e of extras ?? []) {
    if (e.quantity <= 0) continue;
    const ex = extraMap.get(e.id);
    if (!ex) continue;
    lineItems.push({
      quantity: e.quantity,
      price_data: {
        currency: "eur",
        unit_amount: ex.price_cents,
        product_data: { name: ex.name },
      },
    });
  }

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      retreatId,
      stripeSessionId: null,
      customerEmail: customerEmail.trim(),
      customerName: customerName?.trim() || null,
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
  const extraData = (extras ?? [])
    .filter((e) => e.quantity > 0)
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
    customer_email: customerEmail.trim(),
    metadata: { bookingId },
    success_url: `${baseUrl}/retreats/${slug}/book/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/retreats/${slug}/book`,
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
