import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_EMAIL;
  const password = process.env.SEED_PASSWORD;

  if (!email || !password) {
    console.log("Seed skipped. Set SEED_EMAIL and SEED_PASSWORD to create a demo account.");
    return;
  }
  if (password.length < 12) {
    throw new Error("SEED_PASSWORD must be at least 12 characters.");
  }

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      email: email.toLowerCase(),
      displayName: "Alex",
      hashedPassword: await bcrypt.hash(password, 12),
      recoveryStartDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      sobrietyClock: {
        create: {
          startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          target: "My personal goal",
          moneySavedPerDay: 12,
        },
      },
    },
  });
  console.log(`Seed account ready: ${user.email}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
