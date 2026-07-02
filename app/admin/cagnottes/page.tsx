import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import { formatFCFA } from "@/lib/utils/currency";
import { creerCagnotte, changerStatutCagnotte } from "./actions";

const STATUTS = [
  "ouverte",
  "complete",
  "en_construction",
  "en_exploitation",
  "remboursement_foncier",
  "cloturee",
];

export default async function AdminCagnottesPage() {
  const [cagnottes, residences] = await Promise.all([
    prisma.cagnotte.findMany({
      include: { residence: true, _count: { select: { cotisants: true } } },
      orderBy: { dateOuverture: "desc" },
    }),
    prisma.residence.findMany({ orderBy: { nom: "asc" } }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Cagnottes</h1>

        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-neutral-500">
              <th className="py-2 font-medium">Résidence</th>
              <th className="py-2 font-medium">Cotisation/mois</th>
              <th className="py-2 font-medium">Participants</th>
              <th className="py-2 font-medium">Statut</th>
              <th className="py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {cagnottes.map((cagnotte) => (
              <tr key={cagnotte.id} className="border-b border-neutral-100">
                <td className="py-2 text-neutral-900">{cagnotte.residence.nom}</td>
                <td className="py-2 text-neutral-700">{formatFCFA(cagnotte.cotisationMensuelle)}</td>
                <td className="py-2 text-neutral-700">
                  {cagnotte._count.cotisants}/{cagnotte.nbParticipantsRequis}
                </td>
                <td className="py-2">
                  <form
                    action={changerStatutCagnotte.bind(null, cagnotte.id)}
                    className="flex items-center gap-2"
                  >
                    <select
                      name="statut"
                      defaultValue={cagnotte.statut}
                      className="rounded-md border border-neutral-300 px-2 py-1 text-xs"
                    >
                      {STATUTS.map((s) => (
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
                    <Badge statut={cagnotte.statut} />
                  </form>
                </td>
                <td className="py-2">
                  <a
                    href={`/admin/cagnottes/${cagnotte.id}`}
                    className="text-xs font-medium text-amber-800 hover:underline"
                  >
                    Attributions →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Nouvelle cagnotte</h2>
        <form action={creerCagnotte} className="mt-4 grid gap-4 sm:grid-cols-2">
          <select
            name="residenceId"
            required
            className="sm:col-span-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {residences.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nom}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="budgetTotal"
            placeholder="Budget total (FCFA)"
            min={0}
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="prixParcelle"
            placeholder="Prix par parcelle (FCFA)"
            min={0}
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="nbParticipantsRequis"
            placeholder="Nombre de participants requis"
            min={1}
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="cotisationMensuelle"
            placeholder="Cotisation mensuelle (FCFA)"
            min={0}
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
          >
            Créer la cagnotte
          </button>
        </form>
      </div>
    </div>
  );
}
