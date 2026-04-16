# Solimouv - Socle PWA MVP

Socle technique minimal pour le hackathon, base sur `Next.js 16 + Firebase` avec PWA installable.

## Objectif du repo

Ce repo couvre les attendus obligatoires cote dev:

- PWA installable, responsive et deployable
- base d'authentification Firebase (Google + email/mot de passe)
- base Firestore (items utilisateur)
- structure claire et instructions de reproduction

## Stack

- Next.js `16.2.3` (App Router)
- React `19`
- TypeScript
- Tailwind CSS `4`
- Firebase Auth + Firestore

## Structure

```text
src/
  app/
    layout.tsx
    manifest.ts
    page.tsx
    offline/page.tsx
    login/page.tsx
    app/
      layout.tsx
      dashboard/page.tsx
      items/page.tsx
      settings/page.tsx
  components/
    auth-provider.tsx
    auth-guard.tsx
    app-shell.tsx
    pwa-register.tsx
  hooks/
    use-user-items.ts
  lib/
    firebase.ts
public/
  sw.js
  icon-192.png
  icon-512.png
firestore.rules
```

## Setup local

### 1. Installation

```bash
npm install
```

### 2. Variables d'environnement

Copie `.env.example` vers `.env.local` puis renseigne:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 3. Firebase

- activer `Authentication` (Google + Email/Password)
- creer une base `Firestore`
- publier les regles de `firestore.rules`

### 4. Lancement

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Validation des obligatoires

### Socle PWA minimal

- manifest App Router: `src/app/manifest.ts`
- service worker: `public/sw.js`
- page offline: `/offline`
- metadata PWA: `src/app/layout.tsx`

### Checks a executer avant rendu

```bash
npm run lint
npm run build
```

## Deployment (Vercel)

1. Pousser le repo sur GitHub
2. Importer le projet dans Vercel
3. Ajouter les variables d'environnement Firebase (meme valeurs que `.env.local`)
4. Deploy
5. Verifier que l'URL publique charge correctement `/`, `/login`, `/app`

## Verification PWA (navigateur)

1. Ouvrir l'URL en production (HTTPS)
2. Verifier l'installation de l'app (prompt navigateur ou menu "installer")
3. Ouvrir DevTools > Application:
   - Manifest detecte
   - Service Worker actif (`/sw.js`)
4. Passer en mode offline et verifier le fallback `/offline`

## Support non-tech (groupe)

- URL de demo partagee
- procedure courte:
  1. Se connecter
  2. Aller dans Items
  3. Ajouter/cocher/supprimer un item
