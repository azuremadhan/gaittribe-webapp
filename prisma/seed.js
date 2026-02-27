const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash password for admin
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Create ADMIN user
  const admin = await prisma.user.upsert({
    where: { email: "admin@gaittrib.com" },
    update: {},
    create: {
      name: "GAITTRIB Admin",
      email: "admin@gaittrib.com",
      password: hashedPassword,
      role: "ADMIN",
      gender: "MALE",
      age: 30,
      phone: "9999999999",
      profileCompleted: true,
    },
  });

  console.log("✅ Admin created:", admin.email);

  // Create demo event
  const event1 = await prisma.event.create({
    data: {
      title: "Sunday 5K Run",
      description: "Weekly community endurance run.",
      type: "FITNESS",
      date: new Date(),
      price: 250,
      capacity: 50,
      createdById: admin.id,
    },
  });

  console.log("✅ Demo Event Created:", event1.title);

  console.log("🌱 Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });