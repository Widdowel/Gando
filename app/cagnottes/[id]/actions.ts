"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function rejoindreCagnotte(cagnotteId: string) {
  "use server";

  const session = await auth();
  if (!session) redirect("/login");

  await prisma.$transaction(async (tx) => {
    const cagnotte = await tx.cagnotte.findUnique({
      where: { id: cagnotteId },
      include: { _count: { select: { cotisants: true } } },
    });
    if (!cagnotte || cagnotte.statut !== "ouverte") {
      throw new Error("Cette cagnotte n'accepte plus de nouveaux participants");
    }
    if (cagnotte._count.cotisants >= cagnotte.nbParticipantsRequis) {
      throw new Error("Cette cagnotte est complète");
    }

    const dejaInscrit = await tx.cotisation.findFirst({
      where: { cagnotteId, userId: session.user.id },
    });
    if (dejaInscrit) return;

    await tx.cotisation.create({
      data: {
        userId: session.user.id,
        cagnotteId,
        ordreInscription: cagnotte._count.cotisants + 1,
      },
    });
  });

  revalidatePath(`/cagnottes/${cagnotteId}`);
  revalidatePath("/dashboard/cotisant");
}
