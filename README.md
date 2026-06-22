# Répertoire Folk — Gestion du répertoire musical de harpe

## 🎵 Contexte

Application web personnelle pour gérer et visualiser un répertoire de musique folk et traditionnelle (environ 70 morceaux). Développée pour faciliter :
- La visualisation et le suivi de la progression d'apprentissage des morceaux
- Le partage d'informations (partitions, liens d'écoute) à des musiciens ou amis
- L'auto-hébergement des données (pas de dépendance à un tiers)

**Appli de** : Céline

---

## 🎯 Objectifs du dépôt

- Fournir une **application web simple et fonctionnelle** pour gérer un répertoire musical personnel
- Servir de **véhicule d'apprentissage** du développement web (HTML, CSS, JavaScript)
- Permettre une **évolution progressive** vers une architecture plus sophistiquée (PocketBase, auto-hébergement)
- Rester **autonome et respectueux de la vie privée** (données hébergées sur GitHub, pas de service tiers)

---

## 🚀 Accès direct

**📍 Consulter l'application** : https://archiline-c.github.io/Repertoire-folk-cel/

L'application est publique en lecture. Vous pouvez :
- Consulter les morceaux renseignés dans le répertoire
- Filtrer par statut (À apprendre / En apprentissage / Maîtrisé)
- Filtrer par type de danse
- Rechercher par titre ou artiste
- Télécharger les partitions (si disponibles)

En cas de propositions de modifications, écrivez à archiline@protonmail.com

---

## 📋 Fonctionnalités

### ✅ Actuelles (v2)

- **Affichage du répertoire** : liste des morceaux sous forme de cartes
- **Filtres combinables** : par statut de progression, par type de danse
- **Recherche en temps réel** : par titre ou artiste
- **Gestion complète (CRUD)** : ajout, modification, suppression de morceaux
- **Persistance via GitHub** : les données sont sauvegardées dans le fichier `data/morceaux.json` du dépôt
- **Responsive** : consultable sur ordinateur et smartphone
- **Accès sécurisé** : seul le possesseur d'un token GitHub personnel peut modifier les données

### 🔄 En cours de développement ou réflexion

- **Liens vers les partitions** : affichage et édition des chemins PDF pour chaque morceau
- **Liens d'écoute** : références vers des enregistrements (YouTube, The Session, etc.)
- **Historique des révisions** : suivi des dates de jeu/révision par morceau
- **Tonalité et métadonnées enrichies** : ajout progressif de champs supplémentaires
- **Setlist aléatoire** : génération automatique de propositions de jeu selon critères (danses alternées, maîtrise requise, etc.)

### 🎯 Futures (v3)

- **Refactorisation pédagogique** : reprise du code JavaScript pour une meilleure modularité et compréhension
- **Migration vers PocketBase** : remplacement de GitHub par un vrai serveur de base de données
- **Auto-hébergement** : déploiement sur un serveur personnel (MacBook Lubuntu dédié)
- **Authentification multi-utilisateur** : support pour plusieurs musiciens (via PocketBase)
- **Synchronisation locale** : possibilité de fonctionner hors-ligne et de resynchroniser après

---

## 🛠️ Architecture actuelle

### Structure du dépôt

```
Repertoire-folk-cel/
├── index.html           # Page principale
├── script.js            # Logique applicative (vanilla JavaScript)
├── style.css            # Mise en forme (dark mode)
├── data/
│   └── morceaux.json    # Base de données (70 morceaux)
├── partitions/          # PDFs des partitions (à remplir progressivement)
├── images/              # Images associées (couvertures, etc.)
└── README.md            # Ce fichier
```

### Fonctionnement

1. **Lecture** (gratuite, pas de token requis)
   - L'appli charge le JSON depuis `raw.githubusercontent.com`
   - Affiche et filtre les morceaux en JavaScript côté navigateur
   - Les liens vers partitions résolvent en chemins relatifs (GitHub Pages)

2. **Modification** (nécessite un token GitHub Personnel)
   - Saisir un **Personal Access Token** (PAT) dans le formulaire
   - Le token reste en mémoire le temps de la session (jamais enregistré)
   - Chaque modification (ajout/édition/suppression) appelle l'API GitHub
   - GitHub met à jour le fichier JSON et crée un commit
   - La page se met à jour instantanément

---

## 📚 Historique des versions

### v1 — Prototype codé à la main - mars 2026
- Développement progressif et pédagogique
- HTML/CSS/JS écrit pas à pas pour l'apprentissage
- Fonctionnalités de base (affichage, filtres simples)
- Stockage en localStorage (données locales, pas de synchronisation)

→ n'était pas au point pour le stockage des données (en local uniquement) : architecture revue

### v2 — Version actuelle (générée avec Claude) - juin 2026
- Refonte complète avec GitHub comme base de données
- CRUD complet via API GitHub Contents
- 70 morceaux réels importés depuis CSV
- Recherche en temps réel
- Responsive design
- **Environnement de test pour l'apprentissage pédagogique**

### v3 — Prochaine étape envisagée
- Reprise du code JavaScript pour une compréhension en profondeur
- Refactorisation modulaire (séparation logique métier / présentation)
- Migration vers PocketBase
- Support multi-utilisateur
- Interface enrichie

---

## 🔐 Sécurité & Confidentialité

- **Lecture seule publique** : n'importe qui peut consulter l'application, les PDF et les données
- **Écriture protégée** : seul Céline (avec son token GitHub personnel) peut modifier les données
- **Token jamais stocké** : le token est saisi à chaque session et disparaît à la fermeture
- **Données sur GitHub** : hébergement fiable, versionné, avec historique des modifications

⚠️ **Important** : ne jamais partager le token GitHub, et le révoquer immédiatement s'il est exposé.

---

## 🚀 Comment utiliser

### Pour consulter (tous)

1. Ouvrir https://archiline-c.github.io/Repertoire-folk-cel/
2. Utiliser les filtres et la recherche pour explorer les morceaux
3. Télécharger une partition en cliquant sur le lien (si disponible)

Si les fonctionnalités pdf ne sont pas encore implémentées dans l'appli web, ou si elles dysfonctionnent, se rendre directement dans le dossier "partitions" du dépôt github 'brut' :
https://github.com/Archiline-c/Repertoire-folk-cel/tree/main/partitions

### Pour modifier les données (Céline uniquement)

1. Ouvrir le site
2. Scroller jusqu'à la section **"Connexion GitHub"** (en bas de page)
3. Coller votre **Personal Access Token** (généré sur https://github.com/settings/tokens)
4. Cliquer "Se connecter"
5. Le formulaire d'ajout/modification devient actif
6. Ajouter, modifier ou supprimer des morceaux — les changements sont sauvegardés automatiquement sur GitHub

---

## 📖 Contexte pédagogique

Ce projet est aussi un **véhicule d'apprentissage du développement web** :
- Concepts couverts : HTML structure, CSS styling, JavaScript DOM, fetch/API, gestion d'état
- Approche : codage progressif avec explications à chaque étape
- Langage : vanilla JavaScript (pas de framework), pour bien comprendre les mécanismes

Les versions futures incluront une refonte pédagogique pour consolider cette compréhension.

---

## 📝 Données

- **Source initiale** : export CSV du répertoire personnel (encodage Latin-1)
- **Format actuel** : JSON UTF-8, champs réduits (titre, artiste, danse, statut)
- **Nombre de morceaux** : 70
- **Types de danses** : Andro, Bourrée 2/3 temps, Cercle circassien, Fisel, Gavotte, Hanter dro, Kost er c'hoat, Mazurka, Polka, Reel, Ronde, Rondeau, Scottish, Tarentelle, Valse, Valse lente, Valse à 5 temps, Valse écossaise, etc.

---

## 🤝 Contributions

Ce dépôt est personnel, mais les retours et suggestions sont bienvenus. Pour toute question ou proposition :
- Ouvrir une **issue** sur GitHub
- Contacter directement Céline : archiline@protonmail.com

---

## 📜 Licence

Code : Libre d'utilisation pour usage personnel et éducatif.  
Données musicales : répertoire personnel de Céline — usage consultatif uniquement.

---

*Répertoire Folk — Gestion du répertoire de harpe celtique*  
*Développé avec Claude (v2), version initiale v1 codée manuellement pour l'apprentissage*
