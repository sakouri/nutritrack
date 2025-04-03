const express = require('express');
const router = express.Router();
const R = require('ramda');
const bcrypt = require('bcryptjs');
const Utilisateur = require('../models/utilisateur.model');

// Inscription utilisateur
router.post('/inscription', async (req, res) => {
  try {
    console.log('Tentative d\'inscription avec:', req.body);
    const motDePasseHash = await bcrypt.hash(req.body.motDePasse, 10);
    const utilisateur = await Utilisateur.create({
      ...req.body,
      motDePasse: motDePasseHash
    });
    console.log('Utilisateur créé:', utilisateur);
    res.status(201).json({ id: utilisateur._id, nom: utilisateur.nom });
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
    res.status(400).json({ message: err.message });
  }
});

// Connexion utilisateur
router.post('/connexion', async (req, res) => {
  try {
    console.log('Tentative de connexion avec:', req.body); 
    const utilisateur = await Utilisateur.findOne({ email: req.body.email });
    if (!utilisateur) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const validPassword = await bcrypt.compare(req.body.motDePasse, utilisateur.motDePasse);
    if (!validPassword) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    res.json({ utilisateur: { id: utilisateur._id, nom: utilisateur.nom } });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    res.status(500).json({ message: err.message });
  }
});

// Ajouter ou MAJ le goal
router.post('/:id/goals', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id); // chercher l'user dans l'url 
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
// si un goal existe déjà
    if (utilisateur.goals.length > 0) {
      utilisateur.goals[0] = req.body;
    } else {
      utilisateur.goals.push(req.body);
    }
    
    await utilisateur.save();
    res.status(201).json(utilisateur.goals[0]);
  } catch (err) {
    console.error('Erreur lors de la maj du goal:', err);
    res.status(400).json({ message: err.message });
  }
});

// Obtenir le goal actuel
router.get('/:id/goals', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(utilisateur.goals[0] || null);
  } catch (err) {
    console.error('Erreur lors de la récupération du goal:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
