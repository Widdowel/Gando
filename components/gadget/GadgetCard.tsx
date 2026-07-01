import Link from "next/link";
import type { Gadget, Residence, ResidenceType } from "@prisma/client";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatFCFA } from "@/lib/utils/currency";

type GadgetAvecRelations = Gadget & {
  residence: Residence & { type: ResidenceType };
};

export default function GadgetCard({ gadget }: { gadget: GadgetAvecRelations }) {
  return (
    <Link
      href={`/gadgets/${gadget.id}`}
      className="block overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-video bg-neutral-100">
        {gadget.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gadget.photo} alt={gadget.nom} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            {gadget.nom}
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-neutral-400">{gadget.residence.nom}</p>
        <h3 className="mt-1 font-semibold text-neutral-900">{gadget.nom}</h3>
        <p className="mt-2 text-sm text-neutral-600">
          {formatFCFA(gadget.prix)} · récompense {formatFCFA(gadget.recompenseCible)}
        </p>
        <div className="mt-3">
          <ProgressBar actuel={gadget.stockVendu} cible={gadget.stockTotal} label="Vendus" />
        </div>
      </div>
    </Link>
  );
}
