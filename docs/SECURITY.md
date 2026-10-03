# Sécurité — R2A / Cloudflare Pages

## Ce qui est déjà préparé
- `_headers` avec CSP, anti-MIME sniffing, anti-clickjacking, politique de référent et Permissions-Policy.
- Aucun mot de passe administrateur dans le dossier `public/`.
- Les codes promo ne sont plus listés côté client : la validation peut passer par `/api/promo` et le secret Cloudflare `PROMO_CODES_JSON`.
- L’ancien admin local est dans `dev/`, donc hors du dossier publié `public/`.
- `.gitignore` exclut les fichiers de secrets usuels.

## Blocages avant un vrai back-office
Le catalogue, le stock et les Reels sont encore servis depuis du JavaScript statique/localStorage. Ce n’est **pas** un inventaire centralisé. Pour un back-office officiel :
1. utiliser Pages Functions pour l’API ;
2. D1 pour produits / stock / Reels / promos ;
3. R2 pour les images/vidéos uploadées ;
4. protéger `/admin` avec une vraie authentification serveur (Cloudflare Access ou session signée côté Function) ;
5. journaliser les actions admin ;
6. ajouter validation des entrées et contrôle des types/taille de fichiers ;
7. ajouter rate limiting / WAF sur login et API sensibles.

## Interdit en production
- mot de passe dans un fichier JS ;
- liste des codes promo dans le navigateur ;
- clés API dans GitHub ;
- confiance dans `localStorage` pour le stock réel ;
- stockage de numéro de carte bancaire ;
- upload public de fichiers sans contrôle serveur.
