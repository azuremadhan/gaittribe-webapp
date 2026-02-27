import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensurePaymentOrder } from "@/lib/payment";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { registrationId } = (await req.json()) as { registrationId?: string };
  if (!registrationId) {
    return NextResponse.json({ error: "registrationId is required" }, { status: 400 });
  }

  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
  });

  if (!registration || registration.userId !== session.user.id) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  if (registration.status !== "APPROVED") {
    return NextResponse.json({ error: "Registration is not approved" }, { status: 400 });
  }

  const payment = await ensurePaymentOrder(registrationId);

  return NextResponse.json({
    orderId: payment.razorpayOrderId,
    amount: payment.amount,
    keyId: process.env.RAZORPAY_KEY_ID ?? "",
    status: payment.status,
  });
}
