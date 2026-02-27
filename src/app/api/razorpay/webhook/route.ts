import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function verifySignature(body: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return expected === signature;
}

export async function POST(req: Request) {
  const signature = req.headers.get("x-razorpay-signature");
  const rawBody = await req.text();

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          order_id?: string;
          status?: string;
        };
      };
    };
  };

  if (payload.event !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  const orderId = payload.payload?.payment?.entity?.order_id;
  if (!orderId) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId: orderId },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "PAID" },
    }),
    prisma.registration.update({
      where: { id: payment.registrationId },
      data: {
        status: "CONFIRMED",
        paidAt: new Date(),
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
