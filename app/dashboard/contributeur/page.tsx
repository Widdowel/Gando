import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { formatFCFA } from "@/lib/utils/currency";
import { pourcentageProgression, estAchatComplete } from "@/lib/utils/calculs";

export default async function DashboardContributeurPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.type !== "contributeur") redirect("/dashboard");

  const achats = await prisma.achatGadget.findMany({
    where: { userId: session.user.id },
    include: {
      gadget: { include: { residence: true } },
      versements: { orderBy: { dateVersement: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (achats.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Espace contributeur</h1>
        <p className="mt-4 text-neutral-600">
          Vous n&apos;avez pas encore acheté de gadget.{" "}
          <a href="/gadgets" className="font-medium text-amber-800 hover:underline">
            Découvrez les gadgets disponibles
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">Mon espace contributeur</h1>

      <div className="mt-8 space-y-6">
        {achats.map((achat) => {
          const complete = estAchatComplete(achat);
          const dernierVersement = achat.versements[0];

          return (
            <div key={achat.id} className="rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">{achat.gadget.nom}</h2>
                  <p className="text-sm text-neutral-500">{achat.gadget.residence.nom}</p>
                </div>
                <Badge statut={achat.statutLivraison} />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-neutral-500">Cumulé reçu</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {formatFCFA(achat.cumulRecu)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Objectif</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {formatFCFA(achat.recompenseCible)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Dernier versement</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {dernierVersement
                      ? `${formatFCFA(dernierVersement.montant)} · ${dernierVersement.dateVersement.toLocaleDateString("fr-FR")}`
                      : "Aucun"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <ProgressBar
                  actuel={pourcentageProgression(achat.cumulRecu, achat.recompenseCible)}
                  cible={100}
                  label="Progression vers la récompense"
                />
              </div>

              {complete && (
                <p className="mt-4 rounded-md bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
                  Objectif de récompense atteint
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
