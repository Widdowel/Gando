import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PHOTOS_PLACEHOLDER = [
  "https://picsum.photos/seed/terreroyal-facade/800/450",
  "https://picsum.photos/seed/terreroyal-salon/800/450",
  "https://picsum.photos/seed/terreroyal-chambre/800/450",
  "https://picsum.photos/seed/terreroyal-piscine/800/450",
];

const GADGETS_SUPPLEMENTAIRES = [
  {
    nom: "Pack Découverte",
    description:
      "Une première contribution accessible à la construction de la Villa Royale, avec une récompense proportionnée issue des revenus locatifs.",
    prix: 50_000,
    recompenseCible: 75_000,
    stockTotal: 1000,
  },
  {
    nom: "Pack Ambassadeur",
    description:
      "Un engagement intermédiaire pour les contributeurs qui souhaitent un impact plus important, avec une récompense renforcée.",
    prix: 250_000,
    recompenseCible: 375_000,
    stockTotal: 300,
  },
  {
    nom: "Pack Fondateur",
    description:
      "Le niveau de contribution le plus élevé, réservé à un nombre limité de bâtisseurs, avec la récompense la plus généreuse.",
    prix: 500_000,
    recompenseCible: 750_000,
    stockTotal: 100,
  },
];

async function main() {
  const type = await prisma.residenceType.findFirst({
    where: { nom: "Villa Royale 6 Studios" },
  });
  if (!type) {
    throw new Error("Type de résidence 'Villa Royale 6 Studios' introuvable — lancez d'abord le seed principal.");
  }

  const residence = await prisma.residence.findFirst({
    where: { typeId: type.id },
  });
  if (!residence) {
    throw new Error("Résidence introuvable pour ce type.");
  }

  if (type.photos.length === 0) {
    await prisma.residenceType.update({
      where: { id: type.id },
      data: { photos: PHOTOS_PLACEHOLDER },
    });
    console.log(`Photos placeholder ajoutées à "${type.nom}".`);
  } else {
    console.log(`"${type.nom}" a déjà des photos, aucune modification.`);
  }

  for (const gadgetData of GADGETS_SUPPLEMENTAIRES) {
    const existant = await prisma.gadget.findFirst({ where: { nom: gadgetData.nom } });
    if (existant) {
      console.log(`Gadget "${gadgetData.nom}" existe déjà, ignoré.`);
      continue;
    }

    await prisma.gadget.create({
      data: {
        ...gadgetData,
        residenceId: residence.id,
        typeId: type.id,
      },
    });
    console.log(`Gadget "${gadgetData.nom}" créé.`);
  }

  console.log("Terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
