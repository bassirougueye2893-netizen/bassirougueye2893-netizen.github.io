# Portefeuille de compétences interactif — Bassirou Gueye

Site statique (HTML/CSS/JS, aucune compilation nécessaire) présentant les compétences
du BUT3 MMI sous forme d'un globe 3D interactif : chaque point représente un
apprentissage critique (AC), cliquable pour afficher le détail.

## Mettre en ligne (Hostinger ou tout hébergement statique)

1. Connectez-vous à votre espace d'hébergement (ex: Hostinger → File Manager, ou FTP).
2. Ouvrez le dossier racine du site (souvent `public_html/`).
3. Déposez-y **tout le contenu** de ce dossier (`index.html`, `style.css`, `script.js`,
   `data.js`) — pas le dossier lui-même, son contenu.
4. C'est tout : ouvrez votre nom de domaine, le site fonctionne directement.

Aucune base de données, aucun serveur Node, aucune étape de build n'est nécessaire :
tout tourne dans le navigateur (Three.js est chargé depuis un CDN).

## Modifier le contenu

Toutes les compétences (titre, réalisation, justification, bilan) sont dans
**`data.js`**. Pour ajouter, retirer ou modifier un point du globe, éditez le tableau
`COMPETENCY_DATA` dans ce fichier — aucune autre modification n'est nécessaire, le
globe se met à jour automatiquement selon le nombre d'éléments par catégorie.

## Structure

```
index.html    — structure de la page (globe, panneau de détail, légende)
style.css     — habillage visuel (couleurs, typographies, mise en page)
data.js       — contenu : vos compétences, réalisations et bilans
script.js     — logique 3D (Three.js) et interactions
```

## Compatibilité

Fonctionne sur tous les navigateurs récents (Chrome, Firefox, Safari, Edge), ordinateur
et mobile (tactile pris en charge pour faire pivoter le globe).
