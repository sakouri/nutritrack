const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const R = require('ramda');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

// Routes
const utilisateurRoutes = require('./routes/utilisateur.routes');
const mealRoutes = require('./routes/meal.routes');

app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/meals', mealRoutes);

// connexion mongodb
mongoose.set('debug', true); 
mongoose.connect('mongodb://127.0.0.1:27017/nutritrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connecté à MongoDB');
  // vérifier la connexion
  mongoose.connection.db.admin().ping()
    .then(() => console.log('MongoDB répond correctement'))
    .catch(err => console.error('Erreur ping MongoDB:', err));
})
.catch(err => console.error('Erreur de connexion MongoDB:', err));


app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile('index.html', { root: './public' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
