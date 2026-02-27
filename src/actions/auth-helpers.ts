"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function ensureAuthenticated() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      phone: true,
      gender: true,
      age: true,
      profileCompleted: true,
      email: true,
      name: true,
    },
  });

  if (!dbUser) {
    redirect("/signin");
  }

  return dbUser;
}

export async function ensureAdmin() {
  const user = await ensureAuthenticated();
  if (user.role !== "ADMIN") {
    redirect("/");
  }
  return user;
}

export async function ensureProfileCompleted(nextPath?: string) {
  const user = await ensureAuthenticated();
  if (!user.profileCompleted) {
    const suffix = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/complete-profile${suffix}`);
  }
  return user;
}
