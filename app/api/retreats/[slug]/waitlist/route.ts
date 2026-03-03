import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

type WaitlistBody = {
  email?: string;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  let body: WaitlistBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const retreat = await prisma.retreat.findUnique({
    where: { slug },
    select: { id: true, title: true, slug: true },
  });

  if (!retreat) {
    return NextResponse.json({ error: "Retiro no encontrado" }, { status: 404 });
  }

  let created = false;
  try {
    await prisma.waitlistEntry.create({
      data: {
        retreatId: retreat.id,
        email,
      },
    });
    created = true;
  } catch (error: any) {
    if (error?.code !== "P2002") {
      console.error("Error creating waitlist entry:", error);
      return NextResponse.json(
        { error: "No se pudo guardar tu solicitud" },
        { status: 500 },
      );
    }
  }

  if (!created) {
    return NextResponse.json({ ok: true, alreadyExists: true });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { ok: true, notified: false },
      { status: 201 },
    );
  }

  const notifyTo =
    process.env.WAITLIST_NOTIFY_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    "onboarding@resend.dev";

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [notifyTo],
      subject: `Nueva solicitud de lista de espera (${retreat.title})`,
      html: `
        <h2>Nueva solicitud de lista de espera</h2>
        <p><strong>Retiro:</strong> ${retreat.title}</p>
        <p><strong>Slug:</strong> ${retreat.slug}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Fecha:</strong> ${new Date().toISOString()}</p>
      `,
    });

    return NextResponse.json({ ok: true, notified: true }, { status: 201 });
  } catch (error) {
    console.error("Error sending waitlist notification:", error);
    return NextResponse.json({ ok: true, notified: false }, { status: 201 });
  }
}
