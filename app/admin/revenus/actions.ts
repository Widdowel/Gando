"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { calculerRedistributionMutuelle, calculerVersementCrowd } from "@/lib/utils/calculs";

const revenuSchema = z.object({
  residenceId: z.string().min(1),
  mois: z.coerce.number().int().min(1).max(12),
  annee: z.coerce.number().int().min(2020).max(2100),
  revenutBrut: z.coerce.number().int().min(0),
  tauxOccupation: z.coerce.number().min(0).max(100),
});

export async function saisirRevenuLocatif(formData: FormData) {
  const data = revenuSchema.parse({
    residenceId: formData.get("residenceId"),
    mois: formData.get("mois"),
    annee: formData.get("annee"),
    revenutBrut: formData.get("revenutBrut"),
    tauxOccupation: formData.get("tauxOccupation"),
  });

  const fraisGestion = Math.floor(data.revenutBrut * 0.2);
  const revenuNet = data.revenutBrut - fraisGestion;

  await prisma.$transaction(async (tx) => {
    const revenu = await tx.revenuLocatif.create({
      data: {
        residenceId: data.residenceId,
        mois: data.mois,
        annee: data.annee,
        revenutBrut: data.revenutBrut,
        fraisGestion,
        revenuNet,
        tauxOccupation: data.tauxOccupation,
      },
    });

    // Redistribution Mutuelle : répartition égale entre cotisants actifs
    const cotisationsActives = await tx.cotisation.findMany({
      where: { statut: "actif", cagnotte: { residenceId: data.residenceId } },
    });

    if (cotisationsActives.length > 0) {
      const montantParCotisant = calculerRedistributionMutuelle(revenuNet, cotisationsActives.length);
      await tx.redistributionMutuelle.createMany({
        data: cotisationsActives.map((cotisation) => ({
          cotisationId: cotisation.id,
          revenuId: revenu.id,
          montant: montantParCotisant,
        })),
      });
    }

    // Versements Crowdfunding : proportionnel au nombre de gadgets vendus, par type de gadget
    const gadgets = await tx.gadget.findMany({
      where: { residenceId: data.residenceId, stockVendu: { gt: 0 } },
    });

    for (const gadget of gadgets) {
      const versementUnitaire = calculerVersementCrowd(revenuNet, gadget.prix, gadget.stockVendu);
      if (versementUnitaire <= 0) continue;

      const achatsActifs = await tx.achatGadget.findMany({
        where: { gadgetId: gadget.id, statut: "actif" },
      });

      for (const achat of achatsActifs) {
        await tx.versementCrowdfunding.create({
          data: { achatId: achat.id, revenuId: revenu.id, montant: versementUnitaire },
        });

        const nouveauCumul = achat.cumulRecu + versementUnitaire;
        await tx.achatGadget.update({
          where: { id: achat.id },
          data: {
            cumulRecu: nouveauCumul,
            statut: nouveauCumul >= achat.recompenseCible ? "complete" : "actif",
          },
        });
      }
    }
  });

  revalidatePath("/admin/revenus");
  revalidatePath("/dashboard/cotisant");
  revalidatePath("/dashboard/contributeur");
}
