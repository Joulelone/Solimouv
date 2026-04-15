# Hackathon TL - Socle MVP

Base minimale en `Next.js + Firebase + PWA`.

## Ce qui est inclus

- Landing page (`/`)
- Auth Firebase (Google + email/mot de passe) (`/login`)
- App protegee avec navigation:
  - Dashboard (`/app/dashboard`)
  - Items CRUD (`/app/items`)
  - Parametres (`/app/settings`)
- PWA installable (`manifest.json` + `sw.js` + page offline `/offline`)

## 1) Variables d'environnement

Copie `.env.example` vers `.env.local` puis remplis:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 2) Lancer en local

```bash
npm install
npm run dev
```

## 3) Preparer Firebase

- Active `Authentication` (Google + Email/Password)
- Cree une base `Firestore`
- Publie les regles de `firestore.rules`

Ces regles autorisent seulement l'utilisateur connecte a lire/ecrire ses documents (`items`, `events`) via `createdBy`.

## 4) Deployer sur Vercel

```bash
npm run build
```

Puis connecte le dossier `web` a Vercel et ajoute les memes variables d'env.
