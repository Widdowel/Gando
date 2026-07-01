import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const pays = await prisma.pays.upsert({
    where: { code: "BJ" },
    update: {},
    create: {
      code: "BJ",
      nom: "Bénin",
      devise: "FCFA",
      tarifNuitMin: 25000,
      tarifNuitMax: 75000,
    },
  });

  const type = await prisma.residenceType.create({
    data: {
      nom: "Villa Royale 6 Studios",
      standing: "royal",
      nbStudios: 6,
      superficie: 35,
      budgetCible: 80_000_000n,
      descriptionCourte: "Villa royale avec 6 studios meublés haut standing",
      descriptionComplete:
        "Une villa d'exception composée de 6 studios entièrement équipés, pensée pour la location courte durée et l'exploitation touristique. Finitions haut de gamme, sécurité 24/7, piscine commune.",
      equipements: ["Piscine", "Climatisation", "Sécurité 24/7", "Parking", "Groupe électrogène", "Wifi"],
      matterportUrl: "https://my.matterport.com/show/?m=SxQL3iGyvxo",
      photos: [],
      planUrl: null,
    },
  });

  const residence = await prisma.residence.create({
    data: {
      nom: "Terre Royal Cotonou 01",
      paysCode: pays.code,
      typeId: type.id,
      statut: "planifiee",
    },
  });

  const cagnotte = await prisma.cagnotte.create({
    data: {
      residenceId: residence.id,
      budgetTotal: 80_000_000n,
      prixParcelle: 5_333_333n,
      nbParticipantsRequis: 15,
      cotisationMensuelle: 450_000,
      statut: "ouverte",
    },
  });

  const gadget = await prisma.gadget.create({
    data: {
      nom: "Pack Bâtisseur",
      description:
        "Contribuez à la construction de la Villa Royale et recevez une récompense fixe issue des revenus locatifs.",
      prix: 100_000,
      recompenseCible: 150_000,
      stockTotal: 800,
      stockVendu: 0,
      residenceId: residence.id,
      typeId: type.id,
    },
  });

  const motDePasse = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@terreroyal.com" },
    update: {},
    create: {
      nom: "Adjovi",
      prenom: "Admin",
      email: "admin@terreroyal.com",
      password: motDePasse,
      pays: "BJ",
      statutKyc: "verified",
      type: "admin",
    },
  });

  const cotisant = await prisma.user.upsert({
    where: { email: "cotisant@terreroyal.com" },
    update: {},
    create: {
      nom: "Houngbo",
      prenom: "Chantal",
      email: "cotisant@terreroyal.com",
      password: motDePasse,
      pays: "BJ",
      statutKyc: "verified",
      type: "cotisant",
    },
  });

  const contributeur = await prisma.user.upsert({
    where: { email: "contributeur@terreroyal.com" },
    update: {},
    create: {
      nom: "Kone",
      prenom: "Ibrahim",
      email: "contributeur@terreroyal.com",
      password: motDePasse,
      pays: "CI",
      statutKyc: "verified",
      type: "contributeur",
    },
  });

  const cotisation = await prisma.cotisation.create({
    data: {
      userId: cotisant.id,
      cagnotteId: cagnotte.id,
      ordreInscription: 1,
      montantPaye: 450_000n,
      statut: "actif",
      paiements: {
        create: {
          montant: 450_000,
          methodePaiement: "mobile_money",
          reference: "FDP-DEMO-0001",
        },
      },
    },
  });

  await prisma.achatGadget.create({
    data: {
      userId: contributeur.id,
      gadgetId: gadget.id,
      montantPaye: gadget.prix,
      recompenseCible: gadget.recompenseCible,
      cumulRecu: 0,
      statut: "actif",
      statutLivraison: "en_preparation",
    },
  });

  await prisma.gadget.update({
    where: { id: gadget.id },
    data: { stockVendu: { increment: 1 } },
  });

  await prisma.chantierEtape.create({
    data: {
      residenceId: residence.id,
      titre: "Terrassement",
      description: "Préparation du terrain et fondations",
      statut: "planifiee",
      photos: [],
      ordre: 1,
    },
  });

  console.log("Seed terminé :", {
    pays: pays.code,
    residence: residence.nom,
    cagnotte: cagnotte.id,
    gadget: gadget.nom,
    admin: admin.email,
    cotisant: cotisant.email,
    contributeur: contributeur.email,
    cotisation: cotisation.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
