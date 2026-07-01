"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";

const registerSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  email: z.string().email(),
  telephone: z.string().optional(),
  pays: z.enum(["BJ", "TG", "BF", "CI", "AE"]),
  type: z.enum(["cotisant", "contributeur"]),
  password: z.string().min(6),
});

export async function register(formData: FormData) {
  const parsed = registerSchema.safeParse({
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
    email: formData.get("email"),
    telephone: formData.get("telephone") || undefined,
    pays: formData.get("pays"),
    type: formData.get("type"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/register?error=invalide");
  }

  const data = parsed.data;

  const existant = await prisma.user.findUnique({ where: { email: data.email } });
  if (existant) {
    redirect("/register?error=existe");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  await prisma.user.create({
    data: {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone,
      pays: data.pays,
      type: data.type,
      password: passwordHash,
    },
  });

  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login");
    }
    throw error;
  }
}
