import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import { creerResidenceType, creerResidence, changerStatutResidence } from "./actions";

const PAYS = [
  { code: "BJ", nom: "Bénin" },
  { code: "TG", nom: "Togo" },
  { code: "BF", nom: "Burkina Faso" },
  { code: "CI", nom: "Côte d'Ivoire" },
  { code: "AE", nom: "Dubaï" },
];

const STATUTS = ["planifiee", "en_construction", "en_exploitation", "cloturee"];

export default async function AdminResidencesPage() {
  const [types, residences] = await Promise.all([
    prisma.residenceType.findMany({ orderBy: { nom: "asc" } }),
    prisma.residence.findMany({
      include: { type: true, pays: true },
      orderBy: { nom: "asc" },
    }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Résidences</h1>

        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-neutral-500">
              <th className="py-2 font-medium">Nom</th>
              <th className="py-2 font-medium">Pays</th>
              <th className="py-2 font-medium">Type</th>
              <th className="py-2 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {residences.map((residence) => (
              <tr key={residence.id} className="border-b border-neutral-100">
                <td className="py-2 text-neutral-900">{residence.nom}</td>
                <td className="py-2 text-neutral-700">{residence.pays.nom}</td>
                <td className="py-2 text-neutral-700">{residence.type.nom}</td>
                <td className="py-2">
                  <form
                    action={changerStatutResidence.bind(null, residence.id)}
                    className="flex items-center gap-2"
                  >
                    <select
                      name="statut"
                      defaultValue={residence.statut}
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
                    <Badge statut={residence.statut} />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Nouvelle résidence</h2>
        <form action={creerResidence} className="mt-4 grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            name="nom"
            placeholder="Nom de la résidence"
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <select name="paysCode" required className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
            {PAYS.map((p) => (
              <option key={p.code} value={p.code}>
                {p.nom}
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
          <select name="statut" required defaultValue="planifiee" className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
            {STATUTS.map((s) => (
              <option key={s} value={s}>
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
          >
            Créer la résidence
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Types de résidence</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {types.map((type) => (
            <div key={type.id} className="rounded-lg border border-neutral-200 p-4">
              <p className="font-medium text-neutral-900">{type.nom}</p>
              <p className="text-sm text-neutral-500">
                {type.standing} · {type.nbStudios} studios · {type.superficie} m²
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900">Nouveau type de résidence</h3>
          <form action={creerResidenceType} className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="nom"
              placeholder="Nom du type"
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <select name="standing" required className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
              <option value="modeste">Modeste</option>
              <option value="royal">Royal</option>
            </select>
            <input
              type="number"
              name="nbStudios"
              placeholder="Nombre de studios (4-10)"
              min={4}
              max={10}
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              name="superficie"
              placeholder="Superficie par studio (m²)"
              min={1}
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              name="budgetCible"
              placeholder="Budget cible (FCFA)"
              min={0}
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <input
              type="url"
              name="matterportUrl"
              placeholder="URL Matterport"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <textarea
              name="descriptionCourte"
              placeholder="Description courte"
              required
              className="sm:col-span-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <textarea
              name="descriptionComplete"
              placeholder="Description complète"
              required
              className="sm:col-span-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <input
              type="text"
              name="equipements"
              placeholder="Équipements (séparés par des virgules)"
              className="sm:col-span-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <input
              type="text"
              name="photos"
              placeholder="URLs des photos (séparées par des virgules)"
              className="sm:col-span-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <input
              type="url"
              name="planUrl"
              placeholder="URL du plan architectural"
              className="sm:col-span-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="sm:col-span-2 rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
            >
              Créer le type
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
