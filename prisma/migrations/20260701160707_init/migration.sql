-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telephone" TEXT,
    "pays" TEXT NOT NULL,
    "statutKyc" TEXT NOT NULL DEFAULT 'pending',
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Pays" (
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "devise" TEXT NOT NULL,
    "tarifNuitMin" INTEGER NOT NULL,
    "tarifNuitMax" INTEGER NOT NULL,

    CONSTRAINT "Pays_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "ResidenceType" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "standing" TEXT NOT NULL,
    "nbStudios" INTEGER NOT NULL,
    "superficie" INTEGER NOT NULL,
    "budgetCible" BIGINT NOT NULL,
    "descriptionCourte" TEXT NOT NULL,
    "descriptionComplete" TEXT NOT NULL,
    "equipements" TEXT[],
    "matterportUrl" TEXT,
    "photos" TEXT[],
    "planUrl" TEXT,

    CONSTRAINT "ResidenceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Residence" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "paysCode" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'planifiee',

    CONSTRAINT "Residence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cagnotte" (
    "id" TEXT NOT NULL,
    "residenceId" TEXT NOT NULL,
    "budgetTotal" BIGINT NOT NULL,
    "prixParcelle" BIGINT NOT NULL,
    "nbParticipantsRequis" INTEGER NOT NULL,
    "cotisationMensuelle" INTEGER NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'ouverte',
    "dateOuverture" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cagnotte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cotisation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cagnotteId" TEXT NOT NULL,
    "ordreInscription" INTEGER NOT NULL,
    "montantPaye" BIGINT NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'actif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cotisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaiementCotisation" (
    "id" TEXT NOT NULL,
    "cotisationId" TEXT NOT NULL,
    "montant" INTEGER NOT NULL,
    "datePaiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "methodePaiement" TEXT NOT NULL,
    "reference" TEXT,

    CONSTRAINT "PaiementCotisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChantierEtape" (
    "id" TEXT NOT NULL,
    "residenceId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "photos" TEXT[],
    "ordre" INTEGER NOT NULL,

    CONSTRAINT "ChantierEtape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenuLocatif" (
    "id" TEXT NOT NULL,
    "residenceId" TEXT NOT NULL,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "revenutBrut" INTEGER NOT NULL,
    "fraisGestion" INTEGER NOT NULL,
    "revenuNet" INTEGER NOT NULL,
    "tauxOccupation" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevenuLocatif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedistributionMutuelle" (
    "id" TEXT NOT NULL,
    "cotisationId" TEXT NOT NULL,
    "revenuId" TEXT NOT NULL,
    "montant" INTEGER NOT NULL,
    "dateVersement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RedistributionMutuelle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribution" (
    "id" TEXT NOT NULL,
    "cagnotteId" TEXT NOT NULL,
    "cotisationId" TEXT NOT NULL,
    "dateAttribution" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',

    CONSTRAINT "Attribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gadget" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" INTEGER NOT NULL,
    "recompenseCible" INTEGER NOT NULL,
    "stockTotal" INTEGER NOT NULL,
    "stockVendu" INTEGER NOT NULL DEFAULT 0,
    "photo" TEXT,
    "residenceId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,

    CONSTRAINT "Gadget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchatGadget" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gadgetId" TEXT NOT NULL,
    "montantPaye" INTEGER NOT NULL,
    "recompenseCible" INTEGER NOT NULL,
    "cumulRecu" INTEGER NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'actif',
    "statutLivraison" TEXT NOT NULL DEFAULT 'en_preparation',
    "adresseLivraison" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AchatGadget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VersementCrowdfunding" (
    "id" TEXT NOT NULL,
    "achatId" TEXT NOT NULL,
    "revenuId" TEXT NOT NULL,
    "montant" INTEGER NOT NULL,
    "dateVersement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VersementCrowdfunding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Attribution_cotisationId_key" ON "Attribution"("cotisationId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Residence" ADD CONSTRAINT "Residence_paysCode_fkey" FOREIGN KEY ("paysCode") REFERENCES "Pays"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Residence" ADD CONSTRAINT "Residence_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ResidenceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cagnotte" ADD CONSTRAINT "Cagnotte_residenceId_fkey" FOREIGN KEY ("residenceId") REFERENCES "Residence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotisation" ADD CONSTRAINT "Cotisation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotisation" ADD CONSTRAINT "Cotisation_cagnotteId_fkey" FOREIGN KEY ("cagnotteId") REFERENCES "Cagnotte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaiementCotisation" ADD CONSTRAINT "PaiementCotisation_cotisationId_fkey" FOREIGN KEY ("cotisationId") REFERENCES "Cotisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChantierEtape" ADD CONSTRAINT "ChantierEtape_residenceId_fkey" FOREIGN KEY ("residenceId") REFERENCES "Residence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenuLocatif" ADD CONSTRAINT "RevenuLocatif_residenceId_fkey" FOREIGN KEY ("residenceId") REFERENCES "Residence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedistributionMutuelle" ADD CONSTRAINT "RedistributionMutuelle_cotisationId_fkey" FOREIGN KEY ("cotisationId") REFERENCES "Cotisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedistributionMutuelle" ADD CONSTRAINT "RedistributionMutuelle_revenuId_fkey" FOREIGN KEY ("revenuId") REFERENCES "RevenuLocatif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribution" ADD CONSTRAINT "Attribution_cagnotteId_fkey" FOREIGN KEY ("cagnotteId") REFERENCES "Cagnotte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gadget" ADD CONSTRAINT "Gadget_residenceId_fkey" FOREIGN KEY ("residenceId") REFERENCES "Residence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gadget" ADD CONSTRAINT "Gadget_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ResidenceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchatGadget" ADD CONSTRAINT "AchatGadget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchatGadget" ADD CONSTRAINT "AchatGadget_gadgetId_fkey" FOREIGN KEY ("gadgetId") REFERENCES "Gadget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VersementCrowdfunding" ADD CONSTRAINT "VersementCrowdfunding_achatId_fkey" FOREIGN KEY ("achatId") REFERENCES "AchatGadget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VersementCrowdfunding" ADD CONSTRAINT "VersementCrowdfunding_revenuId_fkey" FOREIGN KEY ("revenuId") REFERENCES "RevenuLocatif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
