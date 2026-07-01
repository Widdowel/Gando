"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const gadgetSchema = z.object({
  nom: z.string().min(1),
  description: z.string().min(1),
  prix: z.coerce.number().int().min(0),
  recompenseCible: z.coerce.number().int().min(0),
  stockTotal: z.coerce.number().int().min(1),
  photo: z.string().optional(),
  residenceId: z.string().min(1),
  typeId: z.string().min(1),
});

export async function creerGadget(formData: FormData) {
  const data = gadgetSchema.parse({
    nom: formData.get("nom"),
    description: formData.get("description"),
    prix: formData.get("prix"),
    recompenseCible: formData.get("recompenseCible"),
    stockTotal: formData.get("stockTotal"),
    photo: formData.get("photo"),
    residenceId: formData.get("residenceId"),
    typeId: formData.get("typeId"),
  });

  await prisma.gadget.create({
    data: { ...data, photo: data.photo || null },
  });

  revalidatePath("/admin/gadgets");
}

export async function ajusterStockGadget(gadgetId: string, formData: FormData) {
  const stockTotal = z.coerce.number().int().min(0).parse(formData.get("stockTotal"));
  await prisma.gadget.update({ where: { id: gadgetId }, data: { stockTotal } });
  revalidatePath("/admin/gadgets");
}
