import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { formatMontant, deviseParPays } from "@/lib/utils/currency";

export default async function DashboardCotisantPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.type !== "cotisant") redirect("/dashboard");

  const maintenant = new Date();
  const moisCourant = maintenant.getMonth() + 1;
  const anneeCourante = maintenant.getFullYear();

  const cotisations = await prisma.cotisation.findMany({
    where: { userId: session.user.id },
    include: {
      cagnotte: { include: { residence: { include: { type: true, pays: true } } } },
      paiements: { orderBy: { datePaiement: "desc" } },
      redistribution: { include: { revenu: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (cotisations.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Espace cotisant</h1>
        <p className="mt-4 text-neutral-600">
          Vous n&apos;avez pas encore rejoint de cagnotte.{" "}
          <a href="/cagnottes" className="font-medium text-amber-800 hover:underline">
            Découvrez les cagnottes ouvertes
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">Mon espace cotisant</h1>

      <div className="mt-8 space-y-8">
        {cotisations.map((cotisation) => {
          const devise = deviseParPays(cotisation.cagnotte.residence.paysCode);
          const revenusCeMois = cotisation.redistribution
            .filter((r) => r.revenu.mois === moisCourant && r.revenu.annee === anneeCourante)
            .reduce((total, r) => total + r.montant, 0);

          const chantierEtapes = cotisation.cagnotte.residence.id;

          return (
            <div key={cotisation.id} className="rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {cotisation.cagnotte.residence.nom}
                  </h2>
                  <p className="text-sm text-neutral-500">
                    {cotisation.cagnotte.residence.type.nom} · {cotisation.cagnotte.residence.pays.nom}
                  </p>
                </div>
                <Badge statut={cotisation.statut} />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-neutral-500">Montant épargné</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {formatMontant(cotisation.montantPaye, devise)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Prochaine échéance</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {formatMontant(cotisation.cagnotte.cotisationMensuelle, devise)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Position dans la file</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    #{cotisation.ordreInscription}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-neutral-500">Progression vers la parcelle</p>
                <div className="mt-1">
                  <ProgressBar
                    actuel={Number(cotisation.montantPaye)}
                    cible={Number(cotisation.cagnotte.prixParcelle)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-neutral-500">Revenus locatifs perçus ce mois</p>
                <p className="text-lg font-semibold text-neutral-900">
                  {formatMontant(revenusCeMois, devise)}
                </p>
              </div>

              <SuiviChantier residenceId={chantierEtapes} />

              <div className="mt-6">
                <p className="mb-2 text-xs text-neutral-500">Historique des paiements</p>
                {cotisation.paiements.length === 0 ? (
                  <p className="text-sm text-neutral-400">Aucun paiement enregistré.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 text-left text-neutral-500">
                        <th className="py-2 font-medium">Date</th>
                        <th className="py-2 font-medium">Montant</th>
                        <th className="py-2 font-medium">Méthode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cotisation.paiements.map((paiement) => (
                        <tr key={paiement.id} className="border-b border-neutral-100">
                          <td className="py-2 text-neutral-700">
                            {paiement.datePaiement.toLocaleDateString("fr-FR")}
                          </td>
                          <td className="py-2 text-neutral-700">
                            {formatMontant(paiement.montant, devise)}
                          </td>
                          <td className="py-2 text-neutral-700">{paiement.methodePaiement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

async function SuiviChantier({ residenceId }: { residenceId: string }) {
  const etapes = await prisma.chantierEtape.findMany({
    where: { residenceId },
    orderBy: { ordre: "asc" },
  });

  if (etapes.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="mb-2 text-xs text-neutral-500">Suivi du chantier</p>
      <ol className="space-y-3">
        {etapes.map((etape) => (
          <li key={etape.id} className="rounded-md border border-neutral-100 p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-neutral-900">{etape.titre}</p>
              <Badge statut={etape.statut} />
            </div>
            <p className="mt-1 text-sm text-neutral-600">{etape.description}</p>
            {etape.photos.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {etape.photos.map((photo) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={photo}
                    src={photo}
                    alt={etape.titre}
                    className="h-20 w-28 flex-shrink-0 rounded object-cover"
                  />
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
