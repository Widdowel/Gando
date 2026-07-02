import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import MatterportViewer from "@/components/residence/MatterportViewer";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatFCFA } from "@/lib/utils/currency";
import { acheterGadget } from "./actions";

export default async function GadgetPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const gadget = await prisma.gadget.findUnique({
    where: { id },
    include: { residence: { include: { type: true, pays: true } } },
  });

  if (!gadget) notFound();

  const session = await auth();
  const restants = gadget.stockTotal - gadget.stockVendu;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-neutral-900">{gadget.nom}</h1>
      <p className="text-neutral-500">
        {gadget.residence.nom} · {gadget.residence.pays.nom}
      </p>

      {error === "rupture" && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          Ce gadget vient d&apos;être épuisé — quelqu&apos;un d&apos;autre a acheté la dernière
          unité juste avant vous.
        </p>
      )}

      <div className="mt-8">
        <MatterportViewer url={gadget.residence.type.matterportUrl} titre={gadget.residence.nom} />
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        <div className="sm:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Description</h2>
            <p className="mt-2 text-neutral-600">{gadget.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Résidence associée</h2>
            <p className="mt-2 text-neutral-600">{gadget.residence.type.descriptionCourte}</p>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 p-6">
          <p className="text-sm text-neutral-500">Prix d&apos;achat</p>
          <p className="text-xl font-semibold text-neutral-900">{formatFCFA(gadget.prix)}</p>

          <p className="mt-4 text-sm text-neutral-500">Récompense fixe totale</p>
          <p className="text-xl font-semibold text-neutral-900">
            {formatFCFA(gadget.recompenseCible)}
          </p>

          <div className="mt-6">
            <ProgressBar actuel={gadget.stockVendu} cible={gadget.stockTotal} label="Vendus" />
            <p className="mt-2 text-sm text-neutral-500">
              {restants > 0 ? `${restants} gadget(s) restant(s)` : "Stock épuisé"}
            </p>
          </div>

          <div className="mt-6">
            {!session ? (
              <a
                href="/login"
                className="block w-full rounded-md bg-amber-800 px-4 py-3 text-center font-medium text-white hover:bg-amber-900"
              >
                Se connecter pour acheter
              </a>
            ) : restants <= 0 ? (
              <p className="rounded-md bg-neutral-100 px-4 py-3 text-center text-sm text-neutral-600">
                Ce gadget n&apos;est plus en stock
              </p>
            ) : (
              <form action={acheterGadget.bind(null, gadget.id)}>
                <button
                  type="submit"
                  className="w-full rounded-md bg-amber-800 px-4 py-3 font-medium text-white hover:bg-amber-900"
                >
                  Acheter ce gadget
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
