# R2A — Cloudflare V21

Version rangée et préparée pour Cloudflare Pages.

## Démarrer localement
Sous Windows : double-cliquer `LANCER_LOCAL.bat`, puis ouvrir `http://localhost:8080`.

## Déployer
Cloudflare Pages :
- build command : `exit 0`
- build output : `public`

Lire **avant publication commerciale** :
1. `docs/AUDIT_PUBLICATION.md`
2. `docs/INFORMATIONS_A_COMPLETER.md`
3. `docs/CHECKLIST_CLOUDFLARE.md`
4. `docs/SECURITY.md`

Le dossier `dev/` ne doit pas être publié. Le vrai site public est dans `public/`.


## V22 — mot de passe admin
- Le mot de passe n’est plus affiché dans la page admin.
- Le mot de passe n’est plus présent en clair dans le JavaScript/HTML.
- L’outil local compare maintenant un hash SHA-256.
- Cet admin local reste un outil de développement et ne doit pas être déployé dans `public/`.


## V23 — optimisation smartphones
- viewport avec `viewport-fit=cover` pour iPhone / encoches.
- Header compact et navigation horizontale tactile.
- Hero, cartes, section coach et pages produit adaptés à 320–640 px.
- Galerie produit et miniatures optimisées au tactile.
- Boutons d'achat pleine largeur sur mobile.
- Reels transformés en carrousel horizontal à swiper.
- Panier transformé en bottom-sheet mobile (au lieu du panneau latéral desktop).
- Zones tactiles d'au moins ~44 px.
- Champs de formulaire en 16 px pour éviter le zoom automatique iOS.
- Safe-area iPhone prise en compte dans le header, footer et panier.
- Optimisations pour téléphone très étroit et mode paysage.
- Support `prefers-reduced-motion`.
