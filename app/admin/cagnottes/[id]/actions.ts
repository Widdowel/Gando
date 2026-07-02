"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function attribuerParcelle(cagnotteId: string, cotisationId: string) {
  await prisma.$transaction(async (tx) => {
    const cotisation = await tx.cotisation.findUnique({
      where: { id: cotisationId },
      include: { cagnotte: true, attribution: true },
    });
    if (!cotisation || cotisation.cagnotteId !== cagnotteId) {
      throw new Error("Cotisation introuvable");
    }
    if (cotisation.attribution) {
      throw new Error("Parcelle déjà attribuée");
    }
    if (cotisation.montantPaye < cotisation.cagnotte.prixParcelle) {
      throw new Error("Cotisation non complète");
    }

    const cotisationsDevantElle = await tx.cotisation.findMany({
      where: {
        cagnotteId,
        ordreInscription: { lt: cotisation.ordreInscription },
        montantPaye: { gte: cotisation.cagnotte.prixParcelle },
        attribution: null,
      },
    });
    if (cotisationsDevantElle.length > 0) {
      throw new Error("Des cotisants avec un ordre d'inscription antérieur sont éligibles avant");
    }

    await tx.attribution.create({
      data: { cagnotteId, cotisationId },
    });
  });

  revalidatePath(`/admin/cagnottes/${cagnotteId}`);
}

export async function changerStatutAttribution(attributionId: string, formData: FormData) {
  const statut = z
    .enum(["en_attente", "parcelle_remboursee", "titre_delivre"])
    .parse(formData.get("statut"));

  const attribution = await prisma.attribution.update({
    where: { id: attributionId },
    data: { statut },
  });

  revalidatePath(`/admin/cagnottes/${attribution.cagnotteId}`);
}
