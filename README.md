# NutriTrack v2 - Application de Suivi Nutritionnel

Application de suivi nutritionnel développée en programmation fonctionnelle avec Node.js, Express et MongoDB.

## Installation

1. Cloner le repository
2. Installer les dépendances : `npm install`
3. Créer un fichier `.env` avec vos configurations
4. Démarrer MongoDB
5. Lancer l'application : `npm start`

## API Endpoints

### Repas (Meals)
- POST /api/meals - Ajouter un nouveau repas
- GET /api/meals/utilisateur/:id - Obtenir tous les repas d'un utilisateur
- GET /api/meals/resume/:date/:utilisateurId - Obtenir le résumé nutritionnel d'une journée

### Objectifs
- POST /api/objectifs - Définir un nouvel objectif
- GET /api/objectifs/utilisateur/:id - Obtenir les objectifs d'un utilisateur

### Utilisateurs
- POST /api/utilisateurs/inscription - Créer un compte
- POST /api/utilisateurs/connexion - Se connecter

## Structure du Projet
- `/src/models` - Modèles MongoDB
- `/src/routes` - Routes de l'API
- `/src/utils` - Utilitaires et fonctions pures

## Tests avec Postman

Collection Postman disponible dans le dossier `postman`.
