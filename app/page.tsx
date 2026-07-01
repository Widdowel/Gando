import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CagnotteCard from "@/components/cagnotte/CagnotteCard";

export default async function Home() {
  const cagnottes = await prisma.cagnotte.findMany({
    where: { statut: "ouverte" },
    include: {
      residence: { include: { type: true, pays: true } },
      _count: { select: { cotisants: true } },
    },
    orderBy: { dateOuverture: "desc" },
    take: 3,
  });

  return (
    <div>
      <section className="bg-gradient-to-b from-amber-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Devenez propriétaire, ensemble.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            Terre Royal Mutuelle finance des résidences en Afrique de l&apos;Ouest et à Dubaï
            grâce à deux mécanismes : la Mutuelle Immobilière et le Crowdfunding par récompenses.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/cagnottes"
              className="rounded-md bg-amber-800 px-6 py-3 font-medium text-white hover:bg-amber-900"
            >
              Découvrir les cagnottes
            </Link>
            <Link
              href="/gadgets"
              className="rounded-md border border-amber-800 px-6 py-3 font-medium text-amber-800 hover:bg-amber-50"
            >
              Découvrir les gadgets
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-900">Mutuelle Immobilière</h2>
            <p className="mt-2 text-neutral-600">
              Cotisez mensuellement dans une cagnotte partagée avec d&apos;autres membres. Selon
              votre ordre d&apos;inscription et l&apos;avancement de votre cotisation, recevez
              votre propre parcelle une fois votre tour venu, tout en percevant chaque mois une
              part des revenus locatifs de la résidence.
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-900">Crowdfunding par Récompenses</h2>
            <p className="mt-2 text-neutral-600">
              Achetez un gadget lié à une résidence et recevez progressivement une récompense
              financière fixe, issue des revenus locatifs générés, jusqu&apos;à atteindre
              l&apos;objectif défini à l&apos;achat.
            </p>
          </div>
        </div>
      </section>

      {cagnottes.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-neutral-900">Cagnottes en cours</h2>
            <Link href="/cagnottes" className="text-sm font-medium text-amber-800 hover:underline">
              Voir toutes les cagnottes →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cagnottes.map((cagnotte) => (
              <CagnotteCard key={cagnotte.id} cagnotte={cagnotte} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
