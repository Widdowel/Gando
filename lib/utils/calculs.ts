import type { AchatGadget } from "@prisma/client";

// Calcul redistribution mutuelle mensuelle
export function calculerRedistributionMutuelle(revenuNet: number, nbCotisants: number): number {
  return Math.floor(revenuNet / nbCotisants);
}

// Calcul versement crowdfunding mensuel (proportionnel au prix du gadget)
export function calculerVersementCrowd(
  revenuNet: number,
  prixGadget: number,
  totalGadgetsVendus: number
): number {
  const partUnitaire = revenuNet / totalGadgetsVendus;
  return Math.floor(partUnitaire);
}

// Vérification si un achat gadget est complété
export function estAchatComplete(achat: Pick<AchatGadget, "cumulRecu" | "recompenseCible">): boolean {
  return achat.cumulRecu >= achat.recompenseCible;
}

// Ordre d'attribution des résidences = ordre d'inscription
// Premier inscrit dans la cagnotte = premier à recevoir sa résidence
// quand 100% de sa cotisation est atteinte ET son tour est venu

export function pourcentageProgression(actuel: number | bigint, cible: number | bigint): number {
  const a = typeof actuel === "bigint" ? Number(actuel) : actuel;
  const c = typeof cible === "bigint" ? Number(cible) : cible;
  if (c <= 0) return 0;
  return Math.min(100, Math.floor((a / c) * 100));
}
