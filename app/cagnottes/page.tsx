import { prisma } from "@/lib/prisma";
import CagnotteCard from "@/components/cagnotte/CagnotteCard";

type SearchParams = {
  pays?: string;
  standing?: string;
  disponibles?: string;
};

export default async function CagnottesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [cagnottes, listePays] = await Promise.all([
    prisma.cagnotte.findMany({
      where: {
        ...(params.pays ? { residence: { paysCode: params.pays } } : {}),
        ...(params.standing ? { residence: { type: { standing: params.standing } } } : {}),
      },
      include: {
        residence: { include: { type: true, pays: true } },
        _count: { select: { cotisants: true } },
      },
      orderBy: { dateOuverture: "desc" },
    }),
    prisma.pays.findMany({ orderBy: { nom: "asc" } }),
  ]);

  const cagnottesFiltrees =
    params.disponibles === "1"
      ? cagnottes.filter((c) => c._count.cotisants < c.nbParticipantsRequis)
      : cagnottes;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-neutral-900">Cagnottes ouvertes</h1>
      <p className="mt-2 text-neutral-600">
        Rejoignez une mutuelle immobilière et devenez propriétaire aux côtés d&apos;autres membres.
      </p>

      <form className="mt-6 flex flex-wrap gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <div>
          <label className="block text-xs font-medium text-neutral-500">Pays</label>
          <select
            name="pays"
            defaultValue={params.pays ?? ""}
            className="mt-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="">Tous</option>
            {listePays.map((pays) => (
              <option key={pays.code} value={pays.code}>
                {pays.nom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500">Gamme</label>
          <select
            name="standing"
            defaultValue={params.standing ?? ""}
            className="mt-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="">Toutes</option>
            <option value="modeste">Modeste</option>
            <option value="royal">Royal</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <input
            type="checkbox"
            id="disponibles"
            name="disponibles"
            value="1"
            defaultChecked={params.disponibles === "1"}
            className="h-4 w-4"
          />
          <label htmlFor="disponibles" className="text-sm text-neutral-700">
            Places disponibles uniquement
          </label>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
          >
            Filtrer
          </button>
        </div>
      </form>

      {cagnottesFiltrees.length === 0 ? (
        <p className="mt-12 text-center text-neutral-500">Aucune cagnotte ne correspond à ces critères.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cagnottesFiltrees.map((cagnotte) => (
            <CagnotteCard key={cagnotte.id} cagnotte={cagnotte} />
          ))}
        </div>
      )}
    </div>
  );
}
