import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import { creerEtapeChantier, changerStatutEtape, ajouterPhotoEtape } from "./actions";

const STATUTS = ["planifiee", "en_cours", "terminee"];

export default async function AdminChantierPage() {
  const [residences, etapes] = await Promise.all([
    prisma.residence.findMany({ orderBy: { nom: "asc" } }),
    prisma.chantierEtape.findMany({
      include: { residence: true },
      orderBy: [{ residenceId: "asc" }, { ordre: "asc" }],
    }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Étapes de chantier</h1>

        <div className="mt-4 space-y-4">
          {etapes.map((etape) => (
            <div key={etape.id} className="rounded-lg border border-neutral-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">
                    {etape.residence.nom} — {etape.titre}
                  </p>
                  <p className="text-sm text-neutral-600">{etape.description}</p>
                </div>
                <Badge statut={etape.statut} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <form
                  action={changerStatutEtape.bind(null, etape.id)}
                  className="flex items-center gap-2"
                >
                  <select
                    name="statut"
                    defaultValue={etape.statut}
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
                    Mettre à jour le statut
                  </button>
                </form>

                <form
                  action={ajouterPhotoEtape.bind(null, etape.id)}
                  className="flex items-center gap-2"
                >
                  <input
                    type="url"
                    name="photoUrl"
                    placeholder="URL de la photo"
                    required
                    className="w-56 rounded-md border border-neutral-300 px-2 py-1 text-xs"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-white hover:bg-neutral-900"
                  >
                    Ajouter une photo
                  </button>
                </form>
              </div>

              {etape.photos.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {etape.photos.map((photo) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={photo}
                      src={photo}
                      alt={etape.titre}
                      className="h-16 w-24 flex-shrink-0 rounded object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Nouvelle étape</h2>
        <form action={creerEtapeChantier} className="mt-4 grid gap-4 sm:grid-cols-2">
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
            type="text"
            name="titre"
            placeholder="Titre de l'étape"
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="ordre"
            placeholder="Ordre"
            min={0}
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <select name="statut" required defaultValue="planifiee" className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
            {STATUTS.map((s) => (
              <option key={s} value={s}>
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Description"
            required
            className="sm:col-span-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
          >
            Créer l&apos;étape
          </button>
        </form>
      </div>
    </div>
  );
}
