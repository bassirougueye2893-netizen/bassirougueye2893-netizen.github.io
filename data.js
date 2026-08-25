// Données du portefeuille de compétences — Bassirou Gueye — BUT3 MMI DWDI
// Chaque entrée = un point sur le globe. Modifiez ce fichier pour mettre à jour le contenu
// sans toucher au reste du site.
//
// Pour ajouter une image à une compétence : déposez le fichier dans le dossier
// "assets/" puis renseignez son chemin, par exemple : image: "assets/webprojet.jpg"
// (laissez `image: null` si vous n'avez pas d'image pour cette compétence).

const COMPETENCY_DATA = [
  // ---- Compétence de spécialité : Développer un écosystème numérique complexe ----
  {
    code: "AC33.01",
    image: "assets/web-semantique.jpg",
    category: "specialite",
    title: "Développer à l'aide d'un framework de développement côté client",
    realisation: "Projet Web sémantique",
    part: null,
    justification: null,
    bilan: "Dans le cadre du projet Web sémantique, j'ai développé l'interface utilisateur à l'aide d'un framework front-end, permettant d'afficher dynamiquement les données structurées sans rechargement de page. Niveau atteint : je sais créer une interface qui affiche des données et réagit aux actions de l'utilisateur. Progression : au début j'avais du mal à récupérer les données du serveur, maintenant je sais le faire, et je pourrais encore progresser sur la gestion des erreurs."
  },
  {
    code: "AC33.02",
    image: "assets/web-semantique.jpg",
    category: "specialite",
    title: "Développer à l'aide d'un framework de développement côté serveur",
    realisation: "Projet Web sémantique",
    part: null,
    justification: null,
    bilan: "Pour ce même projet, j'ai mis en place le back-end à l'aide d'un framework serveur chargé d'interroger la source de données et de structurer les réponses avant de les transmettre au client via une API. Niveau atteint : je sais créer une API qui reçoit des demandes et renvoie des données. Progression : j'ai eu des difficultés à bien organiser mon code au début, aujourd'hui c'est plus clair, et je pourrais améliorer la sécurité de mes routes."
  },
  {
    code: "AC33.03",
    image: "assets/unity-parcours-3d.jpg",
    category: "specialite",
    title: "Développer des dispositifs interactifs sophistiqués",
    realisation: "Unity — Jeu de parcours 3D",
    part: null,
    justification: null,
    bilan: "J'ai conçu un jeu de parcours sur Unity, avec gestion des déplacements, des collisions et des interactions en temps réel avec l'environnement 3D. Niveau atteint : je sais faire bouger un personnage et gérer les collisions dans un jeu. Progression : gérer les déplacements précis a été difficile au début, maintenant c'est acquis, et je pourrais encore progresser sur l'intelligence des ennemis ou obstacles."
  },
  {
    code: "AC33.04",
    image: "assets/flutter-japon.jpg",
    category: "specialite",
    title: "Concevoir et développer des composants logiciels, plugins ou extensions",
    realisation: "Application Flutter — Guide touristique du Japon",
    part: null,
    justification: null,
    bilan: "J'ai conçu et développé un guide touristique sur le Japon avec Flutter, en créant des widgets réutilisables (cartes de lieux, système de navigation, fiches détaillées). Niveau atteint : je sais créer des widgets Flutter réutilisables et les assembler pour construire une application complète. Progression : au début j'avais du mal à bien découper mes widgets, maintenant je sais les rendre plus modulaires, et je pourrais encore progresser sur l'utilisation de packages Flutter externes."
  },
  {
    code: "AC33.05",
    image: "assets/web-semantique.jpg",
    category: "specialite",
    title: "Maîtriser l'hébergement et le déploiement d'applications",
    realisation: "Projet Web sémantique — hébergement Hostinger",
    part: null,
    justification: null,
    bilan: "J'ai déployé le projet Web sémantique sur Hostinger, en configurant l'hébergement et la mise en ligne de l'application. Niveau atteint : je sais déployer une application sur un hébergement en ligne et la rendre accessible. Progression : au début j'avais du mal avec la configuration du serveur et des noms de domaine, maintenant c'est plus clair, et je pourrais encore progresser sur le déploiement avec Docker."
  },

  // ---- Compétence transversale : Entreprendre dans le secteur du numérique ----
  {
    code: "AC35.01",
    image: "assets/appli-gestion-repas.jpg",
    category: "transversale",
    title: "Piloter un produit, un service ou une équipe",
    realisation: "Entreprenariat — Application de gestion de repas",
    part: "Organiser les idées du projet et répartir les tâches entre les membres de l'équipe.",
    justification: "J'ai piloté la conception d'un service de repas, avec des menus pour la semaine et un calcul automatique des calories. Ce projet montre ma capacité à définir les besoins du produit, organiser son développement et prendre des décisions pour le faire avancer.",
    bilan: "Niveau atteint : je sais définir les fonctionnalités d'un service et organiser le travail pour les réaliser. Progression : au début j'avais du mal à prioriser les fonctionnalités, maintenant je sais mieux organiser les étapes, et je pourrais encore progresser sur la gestion du temps en équipe."
  },
  {
    code: "AC35.02",
    image: "assets/fake-album-repository.jpg",
    category: "transversale",
    title: "Maîtriser la qualité en projet Web ou multimédia",
    realisation: "Application musicale — Tests unitaires",
    part: null,
    justification: "Sur ce projet, j'ai écrit des tests unitaires en créant un repository de test (FakeAlbumRepository) pour vérifier la logique métier, notamment la récupération de morceaux similaires et le filtrage correct par artiste. Cette démarche m'a permis de m'assurer que les fonctionnalités marchent comme prévu avant leur mise en production.",
    bilan: "Niveau atteint : je sais écrire des tests unitaires simples pour vérifier qu'une fonctionnalité fonctionne correctement. Progression : au début mes tests n'étaient pas assez complets (le fake repository n'était pas paramétrable), et je pourrais encore progresser en rendant mes tests plus flexibles pour couvrir plus de cas."
  },
  {
    code: "AC35.03",
    image: "assets/appli-gestion-repas.jpg",
    category: "transversale",
    title: "Concevoir un projet d'entreprise innovante en définissant le nom, l'identité, la forme juridique et le ton de la marque",
    realisation: "Entreprenariat — Application de gestion de repas interactive",
    part: "De mon côté, j'ai principalement réfléchi à la partie développement web de l'application, en lien avec les choix de marque définis en groupe.",
    justification: "L'application de menu est un service qui propose des menus de repas pour la semaine, accompagnés d'une liste de courses à faire et d'un calcul automatique des calories. Avec mon équipe, nous avons défini le nom, l'identité visuelle et le ton de la marque, ainsi que la forme juridique adaptée pour porter ce projet.",
    bilan: "Niveau atteint : je sais participer à la définition d'une identité de marque en équipe tout en réfléchissant à sa faisabilité technique. Progression : au début il était difficile de faire le lien entre l'identité de marque et les contraintes techniques, maintenant je sais mieux articuler les deux, et je pourrais encore progresser sur les aspects juridiques du projet."
  },
  {
    code: "AC35.04",
    image: "assets/nach.jpg",
    category: "transversale",
    title: "Défendre un projet de manière convaincante",
    realisation: "Entreprenariat — Nach",
    part: "Donner des idées de produit",
    justification: null,
    bilan: null
  },

  // ---- Compétences métiers et soft skills en entreprise (stage Kilifa Consulting) ----
  {
    code: "CM1",
    image: "assets/odoo-vs-dolibarr.jpg",
    category: "metiers",
    title: "Analyser et comparer des solutions logicielles pour répondre à un besoin client",
    realisation: "Étude comparative Odoo vs Dolibarr (semaine 1 — Stage Kilifa Consulting)",
    part: null,
    justification: "J'ai installé et testé deux ERP différents, puis comparé leurs fonctionnalités pour identifier lequel répondait le mieux aux besoins de l'entreprise.",
    bilan: "Au début je ne connaissais pas ces outils, j'ai dû apprendre rapidement à les installer et les utiliser. Cette expérience m'a permis de développer un regard critique sur le choix d'un outil selon un besoin métier, et je pourrais approfondir mes connaissances sur la configuration avancée d'un ERP."
  },
  {
    code: "CM2",
    image: "assets/refonte-site-kilifa.jpg",
    category: "metiers",
    title: "Refondre un site web pour un client en autonomie",
    realisation: "Refonte du site du musée du Mouridisme et du site de Kilifa Consulting (semaines 2-3 — Stage Kilifa Consulting)",
    part: null,
    justification: "J'ai pris en charge la refonte complète de deux sites web réels pour des clients, de la conception à la mise en ligne.",
    bilan: "Travailler directement pour un client final m'a demandé de mieux comprendre ses attentes et de gérer les délais. Au début j'avais du mal à cerner les besoins précis du client, maintenant je sais mieux cadrer un projet de refonte, et je pourrais encore progresser sur la communication client."
  }
];

const CATEGORY_META = {
  specialite:   { label: "Développer un écosystème numérique complexe",  color: 0x4FD8E8 },
  transversale: { label: "Entreprendre dans le secteur du numérique",     color: 0x9C8CFF },
  metiers:      { label: "Métiers & soft skills en entreprise",           color: 0xFFB65C }
};
