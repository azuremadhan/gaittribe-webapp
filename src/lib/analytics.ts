import { prisma } from "@/lib/prisma";

export async function getMostConsistentUsers(limit = 5) {
  const grouped = await prisma.registration.groupBy({
    by: ["userId"],
    where: { status: "CONFIRMED" },
    _count: { userId: true },
    orderBy: { _count: { userId: "desc" } },
    take: limit,
  });

  const userIds = grouped.map((item) => item.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });

  return grouped
    .map((item) => {
      const user = users.find((entry) => entry.id === item.userId);
      if (!user) return null;
      return {
        userId: item.userId,
        name: user.name,
        email: user.email,
        attendanceCount: item._count.userId,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}
