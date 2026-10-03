# Déploiement Cloudflare Pages

## Git / Pages
1. Mettre ce dossier dans un dépôt GitHub privé.
2. Cloudflare > Workers & Pages > Create > Pages > connecter le dépôt.
3. Framework : aucun.
4. Build command : `exit 0` (ou laisser vide si l’interface l’autorise, mais `exit 0` permet d’utiliser facilement Pages Functions).
5. Build output directory : `public`.
6. Root directory : racine du dépôt.
7. Déployer et vérifier `/api/health`.

## Secret codes promo
Dans Cloudflare Pages > Settings > Variables and Secrets, créer un **Secret** :
`PROMO_CODES_JSON`

Exemple de valeur :
```json
[{"code":"EXEMPLE10","type":"percent","value":10,"active":true}]
```
Ne jamais mettre les vrais codes dans Git.

## Domaine
- Ajouter le domaine dans Custom domains.
- Choisir une URL canonique (ex. `example.fr` ou `www.example.fr`).
- Rediriger l’autre version vers la version canonique.
- Rediriger le sous-domaine `*.pages.dev` vers le domaine final via Bulk Redirects.

## Après publication
- Tester 404, panier, mobile, liens légaux, formulaire de rétractation.
- Tester les headers avec `curl -I https://votre-domaine/`.
- Vérifier que `/admin` n’existe pas publiquement tant qu’un vrai back-office sécurisé n’est pas installé.
- Vérifier Lighthouse / accessibilité clavier / contrastes.
