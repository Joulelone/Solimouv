# Inventaire contenus et assets

## 1) Pages et contenus

- `src/app/page.tsx`: Accueil (hero, ateliers, temoignages)
- `src/app/a-propos/page.tsx`: Up Sport! + Solimouv'
- `src/app/programme/*`: programme et selection d'activites
- `src/app/associations/page.tsx`: partenaires
- `src/app/contact/page.tsx`: contact + formulaire
- `src/app/passport/page.tsx`: passeport participant + QR
- `src/app/check-in/page.tsx`: validation stand (organisateur)

## 2) Assets statiques (public)

- `public/icon-192.png`
- `public/icon-512.png`
- `public/figma-logo.svg`
- `public/figma-rectangle.svg`
- `public/hero-figma.svg`
- `public/hero-karate.svg`
- `public/solimouv-logo.svg`

## 3) Assets techniques PWA

- `public/sw.js`
- `src/app/manifest.ts`
- `src/app/offline/page.tsx`

## 4) Donnees et configuration

- Firebase client: `src/lib/firebase.ts`
- Stands festival: `src/lib/festival-stands.ts`
- Regles Firestore: `firestore.rules`
- Exemple variables: `.env.example`

## 5) Export recommande pour livraison client

- Code source complet (`src`, `public`, config racine)
- Documentation (`docs/`)
- Regles et configuration Firebase
- README a jour
