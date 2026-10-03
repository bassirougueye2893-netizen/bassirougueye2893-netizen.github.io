# R2A — V24

Version rangée, préparée pour Cloudflare Pages **ou** GitHub Pages.

⚠️ **Le dossier `public/` a été renommé `docs/`** pour permettre le déploiement sur GitHub Pages (qui ne sait servir que la racine du dépôt ou un dossier `/docs`). L'ancien dossier `docs/` (documentation `.md`) a été renommé `documentation/` pour éviter le conflit de nom.

## Démarrer localement
Sous Windows : double-cliquer `LANCER_LOCAL.bat`, puis ouvrir `http://localhost:8080`.

## Déployer sur GitHub Pages
1. Pousser tout ce dossier (avec sa structure intacte) sur votre dépôt `<utilisateur>.github.io`.
2. Dans Settings → Pages → Build and deployment → Source : *Deploy from a branch*, branche `main`, dossier `/docs`.
3. Le site est en ligne à `https://<utilisateur>.github.io/`.

⚠️ Sur GitHub Pages, `functions/api/promo.js` (code promo serveur) **ne fonctionne pas** : GitHub Pages ne sert que des fichiers statiques. Le code promo nécessite Cloudflare Pages (ou un autre hébergeur avec fonctions serveur).

## Déployer sur Cloudflare Pages
- build command : `exit 0`
- build output : `docs` *(anciennement `public`)*

Lire **avant publication commerciale** :
1. `documentation/AUDIT_PUBLICATION.md`
2. `documentation/INFORMATIONS_A_COMPLETER.md`
3. `documentation/CHECKLIST_CLOUDFLARE.md`
4. `documentation/SECURITY.md`

Le dossier `dev/` ne doit pas être publié publiquement (il contient l'outil d'administration local). Le vrai site public est dans `docs/`.


## V22 — mot de passe admin
- Le mot de passe n’est plus affiché dans la page admin.
- Le mot de passe n’est plus présent en clair dans le JavaScript/HTML.
- L’outil local compare maintenant un hash SHA-256.
- Cet admin local reste un outil de développement et ne doit pas être déployé dans `docs/`.


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
