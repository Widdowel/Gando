"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function changerStatutKyc(userId: string, formData: FormData) {
  const statutKyc = z.enum(["pending", "verified", "rejected"]).parse(formData.get("statutKyc"));
  await prisma.user.update({ where: { id: userId }, data: { statutKyc } });
  revalidatePath("/admin/kyc");
}
