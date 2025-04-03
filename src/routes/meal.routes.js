const express = require('express');
const router = express.Router();
const R = require('ramda');
const Meal = require('../models/meal.model');
const { calculerTotalJournalier, verifierGoal, genererRecommandations } = require('../utils/fonctions');

// Ajouter un repas
router.post('/', async (req, res) => {
  try {
    console.log('Tentative d\'ajout d\'un repas:', req.body);
    const nouveauMeal = await Meal.create(req.body);
    console.log('Repas créé:', nouveauMeal);
    res.status(201).json(nouveauMeal);
  } catch (err) {
    console.error('Erreur lors de l\'ajout du repas:', err);
    res.status(400).json({ message: err.message });
  }
});

// Obtenir tous les repas d'un utilisateur
router.get('/utilisateur/:id', async (req, res) => {
  try {
    console.log('Recherche des repas pour l\'utilisateur:', req.params.id);
    const meals = await Meal.find({ utilisateurId: req.params.id });
    const total = R.pipe(
      R.map(R.pick(['calories', 'proteines', 'glucides', 'lipides'])),
      R.reduce(R.mergeWith(R.add), { calories: 0, proteines: 0, glucides: 0, lipides: 0 })
    )(meals);
    console.log('Repas trouvés:', meals.length, 'Total:', total);
    res.json({ meals, total });
  } catch (err) {
    console.error('Erreur lors de la récupération des repas:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
