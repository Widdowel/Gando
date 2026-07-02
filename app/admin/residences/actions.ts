"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const residenceTypeSchema = z.object({
  nom: z.string().min(1),
  standing: z.enum(["modeste", "royal"]),
  nbStudios: z.coerce.number().int().min(4).max(10),
  superficie: z.coerce.number().int().min(1),
  budgetCible: z.coerce.bigint(),
  descriptionCourte: z.string().min(1),
  descriptionComplete: z.string().min(1),
  equipements: z.string().optional(),
  matterportUrl: z.string().optional(),
  photos: z.string().optional(),
  planUrl: z.string().optional(),
});

export async function creerResidenceType(formData: FormData) {
  const data = residenceTypeSchema.parse({
    nom: formData.get("nom"),
    standing: formData.get("standing"),
    nbStudios: formData.get("nbStudios"),
    superficie: formData.get("superficie"),
    budgetCible: formData.get("budgetCible"),
    descriptionCourte: formData.get("descriptionCourte"),
    descriptionComplete: formData.get("descriptionComplete"),
    equipements: formData.get("equipements"),
    matterportUrl: formData.get("matterportUrl"),
    photos: formData.get("photos"),
    planUrl: formData.get("planUrl"),
  });

  await prisma.residenceType.create({
    data: {
      nom: data.nom,
      standing: data.standing,
      nbStudios: data.nbStudios,
      superficie: data.superficie,
      budgetCible: data.budgetCible,
      descriptionCourte: data.descriptionCourte,
      descriptionComplete: data.descriptionComplete,
      equipements: data.equipements ? data.equipements.split(",").map((s) => s.trim()).filter(Boolean) : [],
      matterportUrl: data.matterportUrl || null,
      photos: data.photos ? data.photos.split(",").map((s) => s.trim()).filter(Boolean) : [],
      planUrl: data.planUrl || null,
    },
  });

  revalidatePath("/admin/residences");
}

const residenceTypeMediaSchema = z.object({
  matterportUrl: z.string().optional(),
  photos: z.string().optional(),
  planUrl: z.string().optional(),
});

export async function modifierMediasResidenceType(typeId: string, formData: FormData) {
  const data = residenceTypeMediaSchema.parse({
    matterportUrl: formData.get("matterportUrl"),
    photos: formData.get("photos"),
    planUrl: formData.get("planUrl"),
  });

  await prisma.residenceType.update({
    where: { id: typeId },
    data: {
      matterportUrl: data.matterportUrl || null,
      photos: data.photos ? data.photos.split(",").map((s) => s.trim()).filter(Boolean) : [],
      planUrl: data.planUrl || null,
    },
  });

  revalidatePath("/admin/residences");
}

const residenceSchema = z.object({
  nom: z.string().min(1),
  paysCode: z.enum(["BJ", "TG", "BF", "CI", "AE"]),
  typeId: z.string().min(1),
  statut: z.enum(["planifiee", "en_construction", "en_exploitation", "cloturee"]),
});

export async function creerResidence(formData: FormData) {
  const data = residenceSchema.parse({
    nom: formData.get("nom"),
    paysCode: formData.get("paysCode"),
    typeId: formData.get("typeId"),
    statut: formData.get("statut"),
  });

  await prisma.residence.create({ data });
  revalidatePath("/admin/residences");
}

export async function changerStatutResidence(residenceId: string, formData: FormData) {
  const statut = z
    .enum(["planifiee", "en_construction", "en_exploitation", "cloturee"])
    .parse(formData.get("statut"));

  await prisma.residence.update({ where: { id: residenceId }, data: { statut } });
  revalidatePath("/admin/residences");
}
