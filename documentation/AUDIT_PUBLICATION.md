# Audit de publication officielle — R2A
Date : 13 septembre 2026

> Ceci est un audit technique et une checklist de conformité, pas une consultation juridique. Les textes définitifs doivent correspondre à la structure réelle de l’entreprise et au parcours de vente réel.

## Verdict
**La vitrine est publiable en préproduction / présentation. La vente commerciale officielle n’est pas encore à considérer comme “terminée” tant que les points BLOQUANTS ci-dessous ne sont pas réglés.**

## BLOQUANTS

### 1. Back-office et stock centralisé
L’ancien admin utilisait un mot de passe visible dans le JS et `localStorage`. Ce n’est ni une authentification, ni une base de données partagée. V21 l’a sorti du dossier `public/`.

À faire pour le vrai site : Pages Functions + D1 (produits, stock, Reels, promos) + authentification serveur/Cloudflare Access. Le schéma de départ est dans `cloudflare/d1/schema.sql`.

### 2. Codes promo
Les codes ne doivent pas être embarqués dans le JS public. V21 prépare `/api/promo`, qui lit le secret `PROMO_CODES_JSON` côté Cloudflare.

### 3. Informations légales réelles
Les pages légales sont maintenant structurées mais contiennent volontairement des champs `[À COMPLÉTER]`. Identité du vendeur, SIREN/SIRET, coordonnées, livraison, paiement, retours, médiateur, etc. doivent être réels avant ouverture des ventes.

### 4. Vente à distance / rétractation
Pour une vente B2C à distance, le client doit notamment être informé avant la commande de ses droits et modalités, dont le droit de rétractation lorsqu’il s’applique. Une page de formulaire est fournie mais doit être raccordée aux CGV définitives.

### 5. Instagram / traceurs
Un iframe Instagram est un contenu tiers susceptible d’appeler Meta et des traceurs. Pour une conformité plus simple, privilégier des MP4 hébergés directement par R2A (Pages/R2), ou ne charger l’iframe qu’après une action/consentement approprié. Ne pas ajouter un bandeau cookies “pour faire joli” : il doit refléter les traceurs réellement utilisés.

## PRIORITÉ HAUTE

### 6. Livraison, prix et parcours de commande
Le prix doit être présenté en euros TTC et les coûts supplémentaires prévisibles (notamment livraison) doivent être communiqués avant l’engagement. Le délai/date de livraison doit aussi être annoncé. Si la commande finale se conclut dans Instagram DM, ces informations doivent tout de même être fournies avant l’accord du consommateur.

### 7. Médiation de la consommation
Un professionnel B2C doit permettre l’accès à un dispositif de médiation et communiquer le médiateur désigné. La vieille plateforme européenne ODR/RLL a cessé d’exister en juillet 2025 : ne pas copier d’anciens modèles de CGV qui contiennent encore ce lien.

### 8. Accessibilité
Depuis le 28 juin 2025, le commerce électronique fait partie des services visés par les nouvelles règles européennes d’accessibilité. Il existe notamment une exemption pour certaines microentreprises prestataires de services (<10 salariés et CA/bilan <2 M€), à vérifier selon le statut réel. Même en cas d’exemption, conserver une navigation clavier, des alt, un contraste correct et des formulaires étiquetés est recommandé.

### 9. Vidéos et droits d’image
Vérifier que R2A possède l’autorisation d’exploiter commercialement les photos/vidéos, la musique éventuellement intégrée aux Reels et les images générées utilisées comme publicité produit. Pour des personnes mineures, vérifier les autorisations spécifiques applicables.

## SÉCURITÉ TECHNIQUE
- [x] CSP / anti-clickjacking / nosniff / Referrer-Policy dans `_headers`.
- [x] secrets promo hors JS public (Function préparée).
- [x] admin local sorti du build public.
- [ ] vrai login serveur et session HttpOnly.
- [ ] D1 pour stock/catalogue central.
- [ ] R2 + validation MIME/taille pour uploads médias.
- [ ] rate limiting sur login/API promo/admin.
- [ ] sauvegardes / export périodique de D1.
- [ ] journal admin et alertes de modification de stock.
- [ ] HSTS après mise en place définitive du domaine HTTPS.

## PERFORMANCE / SEO
- [x] structure d’assets claire.
- [x] 404, robots, redirects.
- [ ] domaine final dans canonical / sitemap.
- [ ] sitemap.xml une fois le domaine connu.
- [ ] images WebP/AVIF et `loading="lazy"` sous la ligne de flottaison.
- [ ] OpenGraph image dédiée 1200×630.
- [ ] favicon / apple-touch-icon.
- [ ] test Lighthouse mobile et Core Web Vitals.

## Références officielles consultées
- DGCCRF — e-commerce B2C : https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/e-commerce-les-regles-entre-professionnels-et-consommateurs
- DGCCRF — information sur les prix : https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/linformation-sur-les-prix
- Économie.gouv — rétractation : https://www.economie.gouv.fr/particuliers/mes-droits-conso/bien-consommer/vente-distance-tout-savoir-sur-votre-droit-de-retractation
- Économie.gouv — médiation : https://www.economie.gouv.fr/mediation-conso/vous-etes-un-professionnel/vos-principales-obligations-0
- CNIL — cookies : https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite
- DGCCRF — accessibilité : https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/professionnels-vos-produits-et-services-doivent-etre-conformes-la-directive-accessibilite
- Cloudflare Pages — headers : https://developers.cloudflare.com/pages/configuration/headers/
- Cloudflare Pages — Functions : https://developers.cloudflare.com/pages/functions/
- Cloudflare Pages — build config : https://developers.cloudflare.com/pages/configuration/build-configuration/
