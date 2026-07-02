"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const paiementSchema = z.object({
  montant: z.coerce.number().int().min(1),
  methodePaiement: z.enum(["mobile_money", "virement", "carte"]),
  reference: z.string().optional(),
});

export async function payerCotisation(cotisationId: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  const data = paiementSchema.parse({
    montant: formData.get("montant"),
    methodePaiement: formData.get("methodePaiement"),
    reference: formData.get("reference") || undefined,
  });

  await prisma.$transaction(async (tx) => {
    const cotisation = await tx.cotisation.findUnique({
      where: { id: cotisationId },
      include: { cagnotte: true },
    });
    if (!cotisation || cotisation.userId !== session.user.id) {
      throw new Error("Cotisation introuvable");
    }

    const montantRestant = cotisation.cagnotte.prixParcelle - cotisation.montantPaye;
    if (montantRestant <= 0n) {
      throw new Error("Cotisation déjà complète");
    }
    const montantAAppliquer = BigInt(Math.min(data.montant, Number(montantRestant)));

    await tx.paiementCotisation.create({
      data: {
        cotisationId,
        montant: Number(montantAAppliquer),
        methodePaiement: data.methodePaiement,
        reference: data.reference,
      },
    });

    const nouveauMontantPaye = cotisation.montantPaye + montantAAppliquer;
    await tx.cotisation.update({
      where: { id: cotisationId },
      data: {
        montantPaye: nouveauMontantPaye,
        statut: nouveauMontantPaye >= cotisation.cagnotte.prixParcelle ? "complete" : cotisation.statut,
      },
    });
  });

  revalidatePath("/dashboard/cotisant");
}
