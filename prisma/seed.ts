import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
  const viewerPassword = process.env.SEED_VIEWER_PASSWORD ?? "consulta123";

  await prisma.user.upsert({
    where: { email: "admin@empresa.com.br" },
    update: {},
    create: {
      email: "admin@empresa.com.br",
      name: "Administrador",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  await prisma.user.upsert({
    where: { email: "consulta@empresa.com.br" },
    update: {},
    create: {
      email: "consulta@empresa.com.br",
      name: "Consulta Contratante",
      role: "CONTRATANTE_VIEWER",
      passwordHash: await bcrypt.hash(viewerPassword, 10),
    },
  });

  console.log("Seed concluído:");
  console.log(`  admin@empresa.com.br / ${adminPassword}`);
  console.log(`  consulta@empresa.com.br / ${viewerPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
