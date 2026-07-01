"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const etapeSchema = z.object({
  residenceId: z.string().min(1),
  titre: z.string().min(1),
  description: z.string().min(1),
  statut: z.enum(["planifiee", "en_cours", "terminee"]),
  ordre: z.coerce.number().int().min(0),
});

export async function creerEtapeChantier(formData: FormData) {
  const data = etapeSchema.parse({
    residenceId: formData.get("residenceId"),
    titre: formData.get("titre"),
    description: formData.get("description"),
    statut: formData.get("statut"),
    ordre: formData.get("ordre"),
  });

  await prisma.chantierEtape.create({ data: { ...data, photos: [] } });
  revalidatePath("/admin/chantier");
}

export async function changerStatutEtape(etapeId: string, formData: FormData) {
  const statut = z.enum(["planifiee", "en_cours", "terminee"]).parse(formData.get("statut"));
  await prisma.chantierEtape.update({ where: { id: etapeId }, data: { statut } });
  revalidatePath("/admin/chantier");
  revalidatePath("/dashboard/cotisant");
}

export async function ajouterPhotoEtape(etapeId: string, formData: FormData) {
  const url = z.string().url().parse(formData.get("photoUrl"));
  const etape = await prisma.chantierEtape.findUniqueOrThrow({ where: { id: etapeId } });
  await prisma.chantierEtape.update({
    where: { id: etapeId },
    data: { photos: [...etape.photos, url] },
  });
  revalidatePath("/admin/chantier");
  revalidatePath("/dashboard/cotisant");
}
