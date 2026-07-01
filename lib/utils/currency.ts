type Devise = "FCFA" | "AED";

export function formatMontant(montant: number | bigint, devise: Devise = "FCFA"): string {
  const valeur = typeof montant === "bigint" ? Number(montant) : montant;
  const formatted = new Intl.NumberFormat("fr-FR").format(valeur);
  return `${formatted} ${devise}`;
}

export function formatFCFA(montant: number | bigint): string {
  return formatMontant(montant, "FCFA");
}

export function formatAED(montant: number | bigint): string {
  return formatMontant(montant, "AED");
}

export function deviseParPays(paysCode: string): Devise {
  return paysCode === "AE" ? "AED" : "FCFA";
}
