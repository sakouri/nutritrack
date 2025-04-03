const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  caloriesQuotidiennes: { type: Number, required: true },
  proteinesQuotidiennes: { type: Number, required: true },
  glucidesQuotidiens: { type: Number, required: true },
  lipidesQuotidiens: { type: Number, required: true }
});

const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now },
  goals: [goalSchema]
});

module.exports = mongoose.model('Utilisateur', utilisateurSchema);
