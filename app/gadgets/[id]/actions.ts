"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function acheterGadget(gadgetId: string) {
  "use server";

  const session = await auth();
  if (!session) redirect("/login");

  await prisma.$transaction(async (tx) => {
    const gadget = await tx.gadget.findUnique({ where: { id: gadgetId } });
    if (!gadget) throw new Error("Gadget introuvable");
    if (gadget.stockVendu >= gadget.stockTotal) {
      throw new Error("Ce gadget n'est plus en stock");
    }

    await tx.achatGadget.create({
      data: {
        userId: session.user.id,
        gadgetId,
        montantPaye: gadget.prix,
        recompenseCible: gadget.recompenseCible,
      },
    });

    await tx.gadget.update({
      where: { id: gadgetId },
      data: { stockVendu: { increment: 1 } },
    });
  });

  revalidatePath(`/gadgets/${gadgetId}`);
  revalidatePath("/dashboard/contributeur");
}
