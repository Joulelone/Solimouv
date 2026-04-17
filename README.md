# Solimouv' - PWA Festival Sport Inclusif

Application web progressive (PWA) pour le festival **Solimouv'** de l'association **Up Sport!**.

Ce README sert de documentation technique principale du projet, en lien avec le brief client, le cadre Hackathon M1 2026, la grille d'evaluation et l'outil d'eco-conception.

## 1) Contexte Client et Hackathon

### Client
- Association: `Up Sport!` (Paris, depuis 2016)
- Mission: rendre le sport accessible a tous les publics, y compris publics vulnerables
- Festival cible: `Solimouv'` (sport inclusif, ateliers, sensibilisation, mise en relation associations/publics)

### Contexte Hackathon M1 2026
- Format: `24h`, presentation finale `4 minutes`
- Livrables attendus: prototype, deploiement, kit de presentation client
- Exigence cle: produire un **bundle exploitable par le client** (autonomie de reprise)
- Contrainte responsable: justifier l'usage de l'outil d'eco-conception Digital Campus

### Sources de cadrage prises en compte
- `contexte/Client.txt`
- `contexte/Hackathon.txt`
- `contexte/Grille d'evaluation - Hackathon M1 - 2026.xlsx`
- `contexte/DC Eco-conception Tool.xlsx`

## 2) Objectifs Produit

Le projet couvre prioritairement:
- **SM-1**: PWA de communication fonctionnelle (installable, responsive, navigation fluide)
- **SM-2**: SEO et referencement (metadata, sitemap, robots, structured data)
- **SM-4**: livraison documentee et reutilisable

Le projet intgre aussi des briques fonctionnelles evenementielles:
- parcours participant (`Mon pass`, progression de stands)
- parcours organisateur (`check-in` QR/manual, validation scan)
- personnalisation programme (selection -> mon programme)

## 3) Perimetre Fonctionnel (Routes)

### Public
- `/landing` - Landing commerciale avec CTA "Rejoins-nous"
- `/` - Home principale festival
- `/a-propos` - presentation Up Sport + Solimouv
- `/programme` - catalogue ateliers + selection
- `/programme/mon-programme` - programme personnalise
- `/contact` - page carte (libelle navigation: "Carte")
- `/associations` - partenaires
- `/passport` - pass participant (auth requis)
- `/organisateur` - espace organisateur
- `/check-in` - entree check-in

### Auth
- `/login` - connexion
- `/inscription` - inscription
- Redirection par defaut post-auth: `/` (sauf `next=...` explicite)

### App interne / demo technique
- `/app`
- `/app/dashboard`
- `/app/items`
- `/app/passport`
- `/app/check-in`
- `/app/settings`

### PWA / SEO
- `/manifest.webmanifest`
- `/offline`
- `/robots.txt`
- `/sitemap.xml`

## 4) Stack Technique

- `Next.js 16.2.3` (App Router, Turbopack)
- `React 19`
- `TypeScript 5`
- `Tailwind CSS 4`
- `Firebase Auth` + `Firestore`
- `Service Worker` custom + `Manifest`

## 5) Architecture du Repo

```text
src/
  app/                    # routes App Router (public, auth, app interne)
  components/             # UI partages (header, burger, auth, shells)
  hooks/                  # logique metier realtime Firestore
  lib/                    # firebase, donnees festival, helpers
public/
  sw.js                   # service worker
  figma-logo.svg          # assets branding
  map/*                   # assets carte
docs/
  01-guide-utilisation-organisateurs.md
  02-documentation-technique.md
  03-inventaire-contenus-assets.md
  04-workflow-git-livraison.md
firestore.rules           # regles de securite Firestore
```

## 6) Flux Metier Principaux

### Parcours participant
1. Arrivee sur `landing` ou `home`
2. `login` / `inscription`
3. consultation `programme` puis creation de `mon-programme`
4. acces `passport` (QR + progression stands)
5. consultation `carte` (`/contact`)

### Parcours organisateur
1. acces `organisateur`
2. passage a `check-in`
3. scan QR (ou saisie manuelle)
4. ecriture d'une validation unique dans `passportScans`
5. retour statut temps reel dans l'interface

## 7) Modele de Donnees Firestore (actuel)

### Collection `items` (demo app interne)
- `title: string`
- `done: boolean`
- `createdBy: string (uid)`
- `createdAt: serverTimestamp`
- `updatedAt: serverTimestamp`

### Collection `passportScans` (coeur evenement)
- document id: `${userId}__${standId}` (unicite scan par stand)
- `userId: string`
- `standId: string`
- `standName: string`
- `scannedBy: string (uid staff)`
- `scannedByEmail: string | null`
- `scannedAt: serverTimestamp`

### Regles de securite (`firestore.rules`)
- acces authentifie uniquement
- `items`: lecture/ecriture sur ses propres documents (`createdBy == auth.uid`)
- `passportScans`:
  - create uniquement si document inexistant
  - schema strict (whitelist des champs)
  - `scannedBy == auth.uid`
  - `scannedAt == request.time`
  - update/delete interdits

## 8) PWA et SEO

### PWA
- Manifest: `src/app/manifest.ts`
- Service worker: `public/sw.js`
- Enregistrement SW: `src/components/pwa-register.tsx`
- Fallback offline: `src/app/offline/page.tsx`

### SEO
- Metadata globales: `src/app/layout.tsx`
- Metadata par pages: `src/app/*/page.tsx`
- Sitemap: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts`
- Structured data (Schema.org Event/Organization): `src/app/page.tsx`

## 9) Eco-conception et Accessibilite

Le projet suit la logique de l'outil `DC Eco-conception Tool` autour de 6 domaines: UX, DA, contenus, communication, data, dev.

### Decisions deja appliquees
- interface mobile-first et responsive (evite duplications)
- medias limites et reutilisation d'assets locaux
- navigation claire, hierarchy simple
- metas SEO et structure semantique de base
- collecte de donnees limitee aux besoins metier (auth, scans, items demo)
- regles Firestore de minimisation et controle d'acces

### Points de vigilance / ameliorations recommandees
- audit RGAA plus complet (focus clavier, lecteurs ecran, alternatives media)
- reduction poids images hero/cartes (formats modernes, compression)
- instrumentation de performance (web vitals + budgets de poids)
- politique de retention et purge planifiee des donnees evenementielles
- documentation formelle privacy/consentement pour production

## 10) Mapping rapide avec la Grille d'Evaluation

Axes majeurs couverts dans ce repository:
- Prototype fonctionnel et navigation demonstrable
- Cohérence UI globale (brand Solimouv)
- Parcours utilisateurs participant + organisateur
- Base technique deployable et documentee
- Premiers elements de pilotage data (scans, progression, dashboard de base)

Elements a completer hors code (selon grille):
- chiffrage detaille solution + planning macro de prod
- support pitch final 3-4 min et video 30-60s
- schema global strategie com/marketing chiffre
- dossier de presentation "client-ready" unique (PDF executive)

## 11) Variables d'Environnement

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

`NEXT_PUBLIC_SITE_URL` est utilise pour sitemap/robots/metadata.

## 12) Installation et Execution

```bash
npm install
npm run dev
```

Build production:

```bash
npm run lint
npm run build
npm run start
```

## 13) Checklist Qualite Avant Livraison

- `npm run lint` sans erreurs
- `npm run build` sans erreurs
- verification parcours:
  - landing -> inscription/connexion -> home
  - programme -> mon-programme
  - passport -> progression
  - check-in QR/manual -> ecriture scan
- verification PWA:
  - manifest accessible
  - service worker actif
  - page offline fonctionnelle
- verification SEO:
  - titles/descriptions
  - sitemap + robots
  - structured data

## 14) Deploiement (Vercel recommande)

1. Pousser le repo sur GitHub
2. Importer le projet dans Vercel
3. Declarer les variables d'environnement
4. Deployer `master`
5. Verifier en prod:
   - login/inscription Firebase
   - pages publiques
   - PWA installable
   - parcours check-in

## 15) Livrables Client a Fournir avec ce Repo

Ce repo couvre la base technique. Pour un bundle client complet:
- guide usage organisateurs (`docs/01-*`)
- documentation technique (`docs/02-*`)
- inventaire assets/contenus (`docs/03-*`)
- workflow git/livraison (`docs/04-*`)
- charte graphique + kit social media (hors code)
- support de pitch + video (hors code)
- note explicative eco-conception (attendue dans la grille)

## 16) Historique de Commits Precis (resume FR)

| Commit | Date | Message Git | Resume FR |
|---|---|---|---|
| `ce67f32` | 2026-04-17 | Add dedicated landing and redesign auth flow | Ajout d'une landing dediee + refonte UX/UI login/inscription. |
| `508d45b` | 2026-04-17 | Update desktop navbar links and labels | Nettoyage navbar desktop (suppression entrees, renommage Contact -> Carte). |
| `6bed166` | 2026-04-17 | fix: ajouter la validation explicite d'un participant détecté | Securisation du flux de validation participant au check-in. |
| `cf327d4` | 2026-04-17 | feat: rendre le programme dynamique entre sélection et mon programme | Liaison dynamique entre selection ateliers et page mon-programme. |
| `633d812` | 2026-04-17 | feat: refonte dashboard organisateur et écran scanner Pass'Sport | Refonte espace organisateur et ecran scanner pass. |
| `a01cda7` | 2026-04-17 | feat(ui): ajouter le nouveau menu burger et refondre la page a propos | Nouveau menu mobile + refonte page A propos. |
| `2532cb6` | 2026-04-17 | feat(programme): ajouter la page mon programme et relier le CTA | Creation page mon programme et branchement CTA. |
| `5ff7d93` | 2026-04-17 | feat(carte): implementer la page carte responsive depuis la maquette Figma | Implementation carte responsive depuis maquette. |
| `c8720a3` | 2026-04-17 | chore(home): mettre a jour l'illustration hero (Rectangle.svg) | Mise a jour visuel hero home. |
| `28d4bf5` | 2026-04-17 | feat(home): refondre la page d'accueil selon la nouvelle maquette Figma | Refonte complete de la home selon Figma. |
| `0c4dbc9` | 2026-04-17 | feat(seo-docs): ajoute metadata, sitemap/robots et pack de documentation client | Renforcement SEO + docs livrables client. |
| `f3c1719` | 2026-04-17 | feat(ui): refond les pages accueil, passeport et programme en mobile-first responsive | Refonte mobile-first des ecrans cles publics. |
| `b7f4561` | 2026-04-16 | feat: add organizer check-in flow and unify site header | Ajout parcours check-in organisateur + header unifie. |
| `6a72412` | 2026-04-16 | feat: add mandatory SM-1 public pages and site navigation | Ajout pages publiques obligatoires du socle. |
| `200a841` | 2026-04-16 | chore: harden mandatory PWA baseline and deliverable docs | Stabilisation socle PWA + docs de livraison. |
| `40fcb99` | 2026-04-16 | chore: ignore local contexte folder | Exclusion du dossier contexte local du versionning. |
| `e2d07f5` | 2026-04-16 | feat: scaffold MVP app shell with Firebase CRUD and PWA baseline | Initialisation shell app + CRUD Firebase + base PWA. |
| `97f8f62` | 2026-04-15 | Initial commit from Create Next App | Initialisation du repository Next.js. |

## 17) Notes Projet

- Le dossier `contexte/` est local au cadrage hackathon et n'est pas destine a la prod.
- Certaines briques "bonus hackathon" (marketing chiffre, video pitch, etc.) sont hors scope code et doivent etre livrees en complement.
- Pour une mise en production evenementielle, prevoir:
  - monitoring,
  - observabilite erreurs,
  - politique RGPD formalisee,
  - tests e2e automatises.

