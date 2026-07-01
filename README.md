# Terre Royal Mutuelle

Application web de financement immobilier participatif au Bénin, Togo, Burkina Faso,
Côte d'Ivoire et Dubaï. Deux produits : une Mutuelle Immobilière et un Crowdfunding
par récompenses physiques.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · PostgreSQL + Prisma · NextAuth.js

## Démarrage

```bash
npm install
cp .env.example .env   # renseigner DATABASE_URL et NEXTAUTH_SECRET
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Comptes de démonstration (mot de passe `password123`) :

- `admin@terreroyal.com` — back-office
- `cotisant@terreroyal.com` — espace Mutuelle
- `contributeur@terreroyal.com` — espace Crowdfunding

## Structure

- `app/` — pages publiques, espaces `dashboard/cotisant` et `dashboard/contributeur`,
  back-office `admin/`
- `lib/` — client Prisma, configuration NextAuth, utilitaires (devise, calculs, Matterport)
- `prisma/` — schéma et script de seed
