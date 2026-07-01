import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import MatterportViewer from "@/components/residence/MatterportViewer";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { formatMontant, deviseParPays } from "@/lib/utils/currency";
import { rejoindreCagnotte } from "./actions";

export default async function CagnottePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cagnotte = await prisma.cagnotte.findUnique({
    where: { id },
    include: {
      residence: { include: { type: true, pays: true } },
      _count: { select: { cotisants: true } },
      cotisants: { select: { userId: true } },
    },
  });

  if (!cagnotte) notFound();

  const session = await auth();
  const devise = deviseParPays(cagnotte.residence.paysCode);
  const placesRestantes = cagnotte.nbParticipantsRequis - cagnotte._count.cotisants;
  const dejaInscrit = session
    ? cagnotte.cotisants.some((c) => c.userId === session.user.id)
    : false;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-3xl font-bold text-neutral-900">{cagnotte.residence.nom}</h1>
        <Badge statut={cagnotte.statut} />
      </div>
      <p className="text-neutral-500">
        {cagnotte.residence.pays.nom} · {cagnotte.residence.type.nom}
      </p>

      <div className="mt-8">
        <MatterportViewer url={cagnotte.residence.type.matterportUrl} titre={cagnotte.residence.nom} />
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        <div className="sm:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Description</h2>
            <p className="mt-2 text-neutral-600">{cagnotte.residence.type.descriptionComplete}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Équipements</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {cagnotte.residence.type.equipements.map((eq) => (
                <li key={eq} className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
                  {eq}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Studios</h2>
            <p className="mt-2 text-neutral-600">
              {cagnotte.residence.type.nbStudios} studios de {cagnotte.residence.type.superficie} m²
              chacun.
            </p>
          </div>

          {cagnotte.residence.type.planUrl && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Plan architectural</h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cagnotte.residence.type.planUrl}
                alt="Plan de la résidence"
                className="mt-2 rounded-lg border border-neutral-200"
              />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-neutral-200 p-6">
          <p className="text-sm text-neutral-500">Budget total</p>
          <p className="text-xl font-semibold text-neutral-900">
            {formatMontant(cagnotte.budgetTotal, devise)}
          </p>

          <p className="mt-4 text-sm text-neutral-500">Montant par participant</p>
          <p className="text-xl font-semibold text-neutral-900">
            {formatMontant(cagnotte.prixParcelle, devise)}
          </p>

          <p className="mt-4 text-sm text-neutral-500">Cotisation mensuelle</p>
          <p className="text-xl font-semibold text-neutral-900">
            {formatMontant(cagnotte.cotisationMensuelle, devise)}
          </p>

          <div className="mt-6">
            <ProgressBar
              actuel={cagnotte._count.cotisants}
              cible={cagnotte.nbParticipantsRequis}
              label="Participants"
            />
            <p className="mt-2 text-sm text-neutral-500">
              {placesRestantes > 0 ? `${placesRestantes} place(s) restante(s)` : "Cagnotte complète"}
            </p>
          </div>

          <div className="mt-6">
            {!session ? (
              <a
                href="/login"
                className="block w-full rounded-md bg-amber-800 px-4 py-3 text-center font-medium text-white hover:bg-amber-900"
              >
                Se connecter pour rejoindre
              </a>
            ) : dejaInscrit ? (
              <p className="rounded-md bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800">
                Vous faites déjà partie de cette cagnotte
              </p>
            ) : cagnotte.statut !== "ouverte" || placesRestantes <= 0 ? (
              <p className="rounded-md bg-neutral-100 px-4 py-3 text-center text-sm text-neutral-600">
                Cette cagnotte n&apos;accepte plus de nouveaux participants
              </p>
            ) : (
              <form action={rejoindreCagnotte.bind(null, cagnotte.id)}>
                <button
                  type="submit"
                  className="w-full rounded-md bg-amber-800 px-4 py-3 font-medium text-white hover:bg-amber-900"
                >
                  Rejoindre cette cagnotte
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
