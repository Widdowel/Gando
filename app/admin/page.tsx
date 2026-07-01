import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [residences, cagnottes, gadgets, kycEnAttente, cotisants, contributeurs] =
    await Promise.all([
      prisma.residence.count(),
      prisma.cagnotte.count({ where: { statut: "ouverte" } }),
      prisma.gadget.count(),
      prisma.user.count({ where: { statutKyc: "pending" } }),
      prisma.user.count({ where: { type: "cotisant" } }),
      prisma.user.count({ where: { type: "contributeur" } }),
    ]);

  const stats = [
    { label: "Résidences", valeur: residences },
    { label: "Cagnottes ouvertes", valeur: cagnottes },
    { label: "Gadgets", valeur: gadgets },
    { label: "KYC en attente", valeur: kycEnAttente },
    { label: "Cotisants", valeur: cotisants },
    { label: "Contributeurs", valeur: contributeurs },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Vue d&apos;ensemble</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900">{stat.valeur}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
