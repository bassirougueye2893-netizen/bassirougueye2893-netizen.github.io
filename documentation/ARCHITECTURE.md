# Architecture R2A V21

Cette version sépare volontairement **ce qui est publié**, **ce qui sert au développement**, **la documentation** et **les futures fonctions Cloudflare**.

```text
R2A_CLOUDFLARE_V21/
├─ docs/                           # SEUL dossier de fichiers statiques publié par Pages
│  ├─ index.html
│  ├─ 404.html
│  ├─ _headers                    # sécurité HTTP Cloudflare Pages
│  ├─ _redirects                  # anciennes URLs / redirections
│  ├─ robots.txt
│  ├─ maillots/                   # pages produits
│  ├─ legal/                      # mentions / CGV / vie privée / rétractation
│  └─ assets/
│     ├─ css/
│     │  ├─ 00-tokens.css         # variables couleurs, dimensions
│     │  ├─ 10-base.css           # reset / body / conteneur
│     │  ├─ 20-components.css     # header, boutons, panier, Reels
│     │  ├─ 30-pages.css          # accueil, produits, stock, sections
│     │  └─ 90-responsive.css     # mobile/tablette
│     ├─ js/
│     │  ├─ site-config.js        # URLs / seuil stock / configuration
│     │  ├─ data/catalog.js       # catalogue statique de secours
│     │  └─ app.js                # comportement du site
│     └─ images/
│        ├─ brand/
│        ├─ products/enfant/
│        ├─ products/homme/
│        ├─ products/femme/
│        ├─ products/shared/
│        ├─ performance/
│        └─ about/
├─ functions/                     # Pages Functions (serveur Cloudflare)
│  └─ api/
│     ├─ health.js
│     └─ promo.js                 # validation des codes promo côté serveur
├─ cloudflare/d1/schema.sql       # schéma prévu pour le futur back-office sécurisé
├─ dev/admin-local/               # OUTIL LOCAL, hors du dossier public
├─ docs/                          # audit, sécurité, checklists
├─ wrangler.jsonc                 # configuration Pages
└─ LANCER_LOCAL.bat
```

## Où modifier quoi ?
- Couleurs / tailles globales : `docs/assets/css/00-tokens.css`
- Header / panier / Reels : `docs/assets/css/20-components.css`
- Accueil / fiches produits / stock : `docs/assets/css/30-pages.css`
- Responsive : `docs/assets/css/90-responsive.css`
- Produits / prix / stock de démonstration : `docs/assets/js/data/catalog.js`
- Instagram, seuil « stock faible » : `docs/assets/js/site-config.js`
- Textes légaux : `docs/legal/`
- Visuels : `docs/assets/images/` puis catégorie correspondante.
