# Documentation technique

## 1) Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Firebase Auth + Firestore
- PWA: manifest + service worker custom

## 2) Architecture (haut niveau)

- `src/app`: routes publiques et routes applicatives
- `src/components`: composants UI et shells
- `src/hooks`: hooks metier (auth, passeport, items)
- `src/lib`: acces Firebase + donnees festival
- `public/sw.js`: service worker

## 3) Acces et variables d'environnement

Configurer `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_SITE_URL=
```

`NEXT_PUBLIC_SITE_URL` sert aux URLs SEO (`sitemap`, `robots`, metadata canonical).

## 4) PWA

- Manifest: `src/app/manifest.ts`
- Service worker: `public/sw.js`
- Enregistrement SW: `src/components/pwa-register.tsx`
- Page offline: `src/app/offline/page.tsx`

## 5) SEO

- Metadata globales + Open Graph + Twitter: `src/app/layout.tsx`
- Metadata par page: `src/app/*/page.tsx`
- Sitemap: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts`
- Donnees structurees (Organization + Event): `src/app/page.tsx`

## 6) Commandes

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```

## 7) Deploiement (Vercel recommande)

1. Importer le repo GitHub dans Vercel.
2. Ajouter les variables d'environnement de `.env.local`.
3. Lancer le deploy de `master`.
4. Verifier:
   - pages publiques
   - login
   - passeport/check-in
   - installation PWA

## 8) Checklist de validation minimale

- `npm run lint` sans erreur
- `npm run build` sans erreur
- Lighthouse mobile > 70 (Performance/Best Practices/SEO/Accessibility)
- navigation clavier de base (menu, liens, boutons, formulaires)
