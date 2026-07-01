import Link from "next/link";
import type { Cagnotte, Residence, ResidenceType, Pays } from "@prisma/client";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { formatMontant, deviseParPays } from "@/lib/utils/currency";

type CagnotteAvecRelations = Cagnotte & {
  residence: Residence & { type: ResidenceType; pays: Pays };
  _count: { cotisants: number };
};

export default function CagnotteCard({ cagnotte }: { cagnotte: CagnotteAvecRelations }) {
  const devise = deviseParPays(cagnotte.residence.paysCode);

  return (
    <Link
      href={`/cagnottes/${cagnotte.id}`}
      className="block overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-video bg-neutral-100">
        {cagnotte.residence.type.photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cagnotte.residence.type.photos[0]}
            alt={cagnotte.residence.nom}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            {cagnotte.residence.type.nom}
          </div>
        )}
        <div className="absolute right-3 top-3">
          <Badge statut={cagnotte.statut} />
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-neutral-400">
          {cagnotte.residence.pays.nom}
        </p>
        <h3 className="mt-1 font-semibold text-neutral-900">{cagnotte.residence.nom}</h3>
        <p className="text-sm text-neutral-500">{cagnotte.residence.type.nom}</p>
        <p className="mt-2 text-sm text-neutral-600">
          {formatMontant(cagnotte.cotisationMensuelle, devise)} / mois
        </p>
        <div className="mt-3">
          <ProgressBar
            actuel={cagnotte._count.cotisants}
            cible={cagnotte.nbParticipantsRequis}
            label="Participants"
          />
        </div>
      </div>
    </Link>
  );
}
