import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const [email, password, prenom, nom] = process.argv.slice(2);

  if (!email || !password || !prenom || !nom) {
    console.error(
      "Usage: npx tsx scripts/create-admin.ts <email> <mot-de-passe> <prenom> <nom>"
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Le mot de passe doit contenir au moins 8 caractères.");
    process.exit(1);
  }

  const existant = await prisma.user.findUnique({ where: { email } });
  if (existant) {
    console.error(`Un utilisateur existe déjà avec l'email ${email}.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      nom,
      prenom,
      email,
      password: passwordHash,
      pays: "BJ",
      statutKyc: "verified",
      type: "admin",
    },
  });

  console.log(`Compte admin créé : ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
