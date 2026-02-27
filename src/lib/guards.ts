import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/signin");

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/");
  return user;
}

export async function requireProfileComplete(nextPath?: string) {
  const user = await requireUser();
  if (!user.profileCompleted) {
    const suffix = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/complete-profile${suffix}`);
  }
  return user;
}
