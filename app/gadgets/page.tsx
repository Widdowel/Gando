import { prisma } from "@/lib/prisma";
import GadgetCard from "@/components/gadget/GadgetCard";

export default async function GadgetsPage() {
  const gadgets = await prisma.gadget.findMany({
    include: { residence: { include: { type: true } } },
    orderBy: { nom: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-neutral-900">Gadgets Crowdfunding</h1>
      <p className="mt-2 text-neutral-600">
        Achetez un gadget et recevez une récompense fixe issue des revenus locatifs de la résidence
        associée.
      </p>

      {gadgets.length === 0 ? (
        <p className="mt-12 text-center text-neutral-500">Aucun gadget disponible pour le moment.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gadgets.map((gadget) => (
            <GadgetCard key={gadget.id} gadget={gadget} />
          ))}
        </div>
      )}
    </div>
  );
}
