const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  nom: { type: String, required: true },
  calories: { type: Number, required: true },
  proteines: { type: Number, required: true },
  glucides: { type: Number, required: true },
  lipides: { type: Number, required: true }
});

module.exports = mongoose.model('Meal', mealSchema);
