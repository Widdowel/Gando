import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import { formatMontant, deviseParPays } from "@/lib/utils/currency";
import { attribuerParcelle, changerStatutAttribution } from "./actions";

const STATUTS_ATTRIBUTION = ["en_attente", "parcelle_remboursee", "titre_delivre"];

export default async function AdminCagnotteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cagnotte = await prisma.cagnotte.findUnique({
    where: { id },
    include: {
      residence: { include: { pays: true } },
      cotisants: {
        include: { user: true, attribution: true },
        orderBy: { ordreInscription: "asc" },
      },
    },
  });

  if (!cagnotte) notFound();

  const devise = deviseParPays(cagnotte.residence.paysCode);

  const premierEligibleSansAttribution = cagnotte.cotisants.find(
    (c) => c.montantPaye >= cagnotte.prixParcelle && !c.attribution
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">{cagnotte.residence.nom}</h1>
      <p className="text-sm text-neutral-500">
        Prix par parcelle : {formatMontant(cagnotte.prixParcelle, devise)}
      </p>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500">
            <th className="py-2 font-medium">Ordre</th>
            <th className="py-2 font-medium">Cotisant</th>
            <th className="py-2 font-medium">Épargné</th>
            <th className="py-2 font-medium">Attribution</th>
          </tr>
        </thead>
        <tbody>
          {cagnotte.cotisants.map((cotisation) => {
            const complete = cotisation.montantPaye >= cagnotte.prixParcelle;
            const estLeProchain = premierEligibleSansAttribution?.id === cotisation.id;

            return (
              <tr key={cotisation.id} className="border-b border-neutral-100">
                <td className="py-2 text-neutral-700">#{cotisation.ordreInscription}</td>
                <td className="py-2 text-neutral-900">
                  {cotisation.user.prenom} {cotisation.user.nom}
                </td>
                <td className="py-2 text-neutral-700">
                  {formatMontant(cotisation.montantPaye, devise)} / {formatMontant(cagnotte.prixParcelle, devise)}
                </td>
                <td className="py-2">
                  {cotisation.attribution ? (
                    <form
                      action={changerStatutAttribution.bind(null, cotisation.attribution.id)}
                      className="flex items-center gap-2"
                    >
                      <select
                        name="statut"
                        defaultValue={cotisation.attribution.statut}
                        className="rounded-md border border-neutral-300 px-2 py-1 text-xs"
                      >
                        {STATUTS_ATTRIBUTION.map((s) => (
                          <option key={s} value={s}>
                            {s.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-white hover:bg-neutral-900"
                      >
                        Mettre à jour
                      </button>
                      <Badge statut={cotisation.attribution.statut} />
                    </form>
                  ) : complete && estLeProchain ? (
                    <form action={attribuerParcelle.bind(null, cagnotte.id, cotisation.id)}>
                      <button
                        type="submit"
                        className="rounded-md bg-amber-800 px-3 py-1 text-xs font-medium text-white hover:bg-amber-900"
                      >
                        Attribuer la parcelle
                      </button>
                    </form>
                  ) : complete ? (
                    <span className="text-xs text-neutral-400">En attente de son tour</span>
                  ) : (
                    <span className="text-xs text-neutral-400">Cotisation non complète</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
