import { prisma } from "@/lib/prisma";
import { formatFCFA } from "@/lib/utils/currency";
import { creerGadget, ajusterStockGadget } from "./actions";

export default async function AdminGadgetsPage() {
  const [gadgets, residences, types] = await Promise.all([
    prisma.gadget.findMany({ include: { residence: true }, orderBy: { nom: "asc" } }),
    prisma.residence.findMany({ orderBy: { nom: "asc" } }),
    prisma.residenceType.findMany({ orderBy: { nom: "asc" } }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Gadgets</h1>

        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-neutral-500">
              <th className="py-2 font-medium">Nom</th>
              <th className="py-2 font-medium">Résidence</th>
              <th className="py-2 font-medium">Prix</th>
              <th className="py-2 font-medium">Vendus</th>
              <th className="py-2 font-medium">Stock total</th>
            </tr>
          </thead>
          <tbody>
            {gadgets.map((gadget) => (
              <tr key={gadget.id} className="border-b border-neutral-100">
                <td className="py-2 text-neutral-900">{gadget.nom}</td>
                <td className="py-2 text-neutral-700">{gadget.residence.nom}</td>
                <td className="py-2 text-neutral-700">{formatFCFA(gadget.prix)}</td>
                <td className="py-2 text-neutral-700">{gadget.stockVendu}</td>
                <td className="py-2">
                  <form
                    action={ajusterStockGadget.bind(null, gadget.id)}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="number"
                      name="stockTotal"
                      defaultValue={gadget.stockTotal}
                      min={gadget.stockVendu}
                      className="w-24 rounded-md border border-neutral-300 px-2 py-1 text-xs"
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-white hover:bg-neutral-900"
                    >
                      Mettre à jour
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Nouveau gadget</h2>
        <form action={creerGadget} className="mt-4 grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            name="nom"
            placeholder="Nom du gadget"
            required
            className="sm:col-span-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <textarea
            name="description"
            placeholder="Description"
            required
            className="sm:col-span-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <select
            name="residenceId"
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {residences.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nom}
              </option>
            ))}
          </select>
          <select name="typeId" required className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nom}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="prix"
            placeholder="Prix d'achat (FCFA)"
            min={0}
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="recompenseCible"
            placeholder="Récompense cible (FCFA)"
            min={0}
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="stockTotal"
            placeholder="Stock total"
            min={1}
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="url"
            name="photo"
            placeholder="URL photo"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
          >
            Créer le gadget
          </button>
        </form>
      </div>
    </div>
  );
}
