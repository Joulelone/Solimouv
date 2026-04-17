# Workflow Git & Livraison

Objectif: garder un historique propre et comprehensible pour l'association.

## Branches

- `master`: production stable
- `develop`: integration continue des features
- `feature/*`: nouvelles fonctionnalites (ex: `feature/programme-responsive`)
- `release/*`: preparation de livraison (ex: `release/v0.2.0`)
- `hotfix/*`: correction urgente depuis `master`

## Cycle recommande

1. Creer une branche feature depuis `develop`.
2. Commiter avec des messages clairs en francais.
3. Ouvrir une Pull Request vers `develop`.
4. Quand le lot est pret, creer `release/*`.
5. Valider QA puis merger `release/*` vers `master` et `develop`.
6. Tagger la version (`v0.1`, `v0.2`, `v1.0`).

## Convention de commit (francais)

Format:

```text
type(scope): resume court
```

Exemples:

- `feat(programme): ajoute la page programme mobile-first`
- `fix(passport): corrige l'affichage desktop pleine largeur`
- `docs(readme): ajoute le plan de livraison client`

## Commandes utiles

```bash
# creation develop
git checkout -b develop
git push -u origin develop

# creation feature
git checkout develop
git checkout -b feature/nom-de-feature

# push feature
git push -u origin feature/nom-de-feature

# release
git checkout develop
git checkout -b release/v0.2.0
git push -u origin release/v0.2.0
```

## Definition of done avant merge

- `npm run lint` OK
- `npm run build` OK
- verification manuelle mobile + desktop
- mise a jour README + docs si impact fonctionnel
