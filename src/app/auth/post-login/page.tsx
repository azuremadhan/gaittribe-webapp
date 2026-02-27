import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PostLoginPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect("/signin");
  }

  if (!user.profileCompleted) {
    redirect("/complete-profile");
  }

  redirect("/");
}
