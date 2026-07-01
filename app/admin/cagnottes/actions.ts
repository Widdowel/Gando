"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const cagnotteSchema = z.object({
  residenceId: z.string().min(1),
  budgetTotal: z.coerce.bigint(),
  prixParcelle: z.coerce.bigint(),
  nbParticipantsRequis: z.coerce.number().int().min(1),
  cotisationMensuelle: z.coerce.number().int().min(0),
});

export async function creerCagnotte(formData: FormData) {
  const data = cagnotteSchema.parse({
    residenceId: formData.get("residenceId"),
    budgetTotal: formData.get("budgetTotal"),
    prixParcelle: formData.get("prixParcelle"),
    nbParticipantsRequis: formData.get("nbParticipantsRequis"),
    cotisationMensuelle: formData.get("cotisationMensuelle"),
  });

  await prisma.cagnotte.create({ data });
  revalidatePath("/admin/cagnottes");
}

const STATUTS = [
  "ouverte",
  "complete",
  "en_construction",
  "en_exploitation",
  "remboursement_foncier",
  "cloturee",
] as const;

export async function changerStatutCagnotte(cagnotteId: string, formData: FormData) {
  const statut = z.enum(STATUTS).parse(formData.get("statut"));
  await prisma.cagnotte.update({ where: { id: cagnotteId }, data: { statut } });
  revalidatePath("/admin/cagnottes");
}
