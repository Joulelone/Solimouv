# Solimouv' - PWA festival sport inclusif

Application web progressive (PWA) pour presenter le festival Solimouv', Up Sport! et les associations partenaires, avec un mode evenement (passeport + check-in).

## Objectif

Fournir un socle **livrable client** couvrant les besoins:

- **SM-1**: PWA de communication (installable, responsive, navigation fluide)
- **SM-2**: SEO et referencement naturel
- **SM-4**: documentation et livraison autonome

## Stack technique

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Firebase Auth + Firestore
- Service Worker custom + Manifest

## Pages principales

- `/` Accueil
- `/a-propos` A propos (Up Sport! + Solimouv')
- `/programme` Programme / ateliers
- `/associations` Associations partenaires
- `/contact` Contact
- `/passport` Passeport participant (mode evenement)
- `/check-in` Check-in stand (mode evenement)

## Couverture des exigences

### SM-1 - PWA communication

- Manifest: `src/app/manifest.ts`
- Service worker: `public/sw.js`
- Enregistrement SW: `src/components/pwa-register.tsx`
- Offline fallback: `src/app/offline/page.tsx`
- UI mobile-first + desktop responsive

### SM-2 - SEO

- Metadata globales + Open Graph + Twitter: `src/app/layout.tsx`
- Metadata par page: `src/app/*/page.tsx`
- Sitemap: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts`
- Donnees structurees Schema.org (Organization + Event): `src/app/page.tsx`

### SM-4 - Livraison client

- Guide d'utilisation organisateurs: `docs/01-guide-utilisation-organisateurs.md`
- Documentation technique: `docs/02-documentation-technique.md`
- Inventaire contenus/assets: `docs/03-inventaire-contenus-assets.md`
- Workflow Git et livraison: `docs/04-workflow-git-livraison.md`

## Installation locale

### 1) Installer les dependances

```bash
npm install
```

### 2) Configurer les variables

Copier `.env.example` vers `.env.local` puis renseigner:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_SITE_URL=
```

### 3) Lancer le projet

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

## Checklist de validation avant livraison

```bash
npm run lint
npm run build
```

Puis verifier:

- Installation PWA mobile + desktop
- Navigation sur toutes les pages SM-1
- Accessibilite de base (clavier, contraste, lisibilite)
- SEO technique (meta, sitemap, robots, JSON-LD)
- Lighthouse mobile > 70

## Workflow Git recommande

Reference complete: `docs/04-workflow-git-livraison.md`

Branches:

- `master` (production)
- `develop` (integration)
- `feature/*`, `release/*`, `hotfix/*`

Commits en francais et explicites, puis PR vers `develop`.

## Deploiement (Vercel)

1. Push du repo sur GitHub
2. Import du projet dans Vercel
3. Ajout des variables d'environnement
4. Deploy
5. Verification fonctionnelle + PWA + SEO
