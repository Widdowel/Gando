import { prisma } from "@/lib/prisma";
import { formatFCFA } from "@/lib/utils/currency";
import { saisirRevenuLocatif } from "./actions";

const MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export default async function AdminRevenusPage() {
  const [revenus, residences] = await Promise.all([
    prisma.revenuLocatif.findMany({
      include: { residence: true },
      orderBy: [{ annee: "desc" }, { mois: "desc" }],
      take: 20,
    }),
    prisma.residence.findMany({ orderBy: { nom: "asc" } }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Revenus locatifs</h1>
        <p className="mt-1 text-sm text-neutral-500">
          La saisie d&apos;un revenu déclenche automatiquement le calcul de la redistribution
          mutuelle et des versements crowdfunding.
        </p>

        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-neutral-500">
              <th className="py-2 font-medium">Résidence</th>
              <th className="py-2 font-medium">Période</th>
              <th className="py-2 font-medium">Brut</th>
              <th className="py-2 font-medium">Frais (20%)</th>
              <th className="py-2 font-medium">Net</th>
              <th className="py-2 font-medium">Occupation</th>
            </tr>
          </thead>
          <tbody>
            {revenus.map((revenu) => (
              <tr key={revenu.id} className="border-b border-neutral-100">
                <td className="py-2 text-neutral-900">{revenu.residence.nom}</td>
                <td className="py-2 text-neutral-700">
                  {MOIS[revenu.mois - 1]} {revenu.annee}
                </td>
                <td className="py-2 text-neutral-700">{formatFCFA(revenu.revenutBrut)}</td>
                <td className="py-2 text-neutral-700">{formatFCFA(revenu.fraisGestion)}</td>
                <td className="py-2 font-medium text-neutral-900">{formatFCFA(revenu.revenuNet)}</td>
                <td className="py-2 text-neutral-700">{revenu.tauxOccupation}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Saisir un revenu mensuel</h2>
        <form action={saisirRevenuLocatif} className="mt-4 grid gap-4 sm:grid-cols-2">
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
          <select name="mois" required defaultValue={new Date().getMonth() + 1} className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
            {MOIS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="annee"
            defaultValue={new Date().getFullYear()}
            min={2020}
            max={2100}
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="revenutBrut"
            placeholder="Revenu brut (FCFA)"
            min={0}
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="tauxOccupation"
            placeholder="Taux d'occupation (%)"
            min={0}
            max={100}
            step="0.1"
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
          >
            Enregistrer et calculer les redistributions
          </button>
        </form>
      </div>
    </div>
  );
}
