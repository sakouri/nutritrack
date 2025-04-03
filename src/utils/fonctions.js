const R = require('ramda');

// fonctions pures pour les calculs nutritionnels
const calculerTotalJournalier = R.pipe(
  R.map(R.pick(['calories', 'proteines', 'glucides', 'lipides'])),
  R.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    proteines: acc.proteines + meal.proteines,
    glucides: acc.glucides + meal.glucides,
    lipides: acc.lipides + meal.lipides
  }), { calories: 0, proteines: 0, glucides: 0, lipides: 0 })
);

const verifierGoal = (total, goal) => ({
  calories: total.calories <= goal.caloriesQuotidiennes,
  proteines: total.proteines >= goal.proteinesQuotidiennes,
  glucides: total.glucides <= goal.glucidesQuotidiens,
  lipides: total.lipides <= goal.lipidesQuotidiens
});

const genererRecommandations = (total, goal) => {
  const recommandations = [];
  
  if (total.calories < goal.caloriesQuotidiennes * 0.5) {
    recommandations.push('Mangez plus');
  }
  
  if (total.proteines < goal.proteinesQuotidiennes * 0.7) {
    recommandations.push('Augmentez votre apport en protéines');
  }
  
  if (total.calories > goal.caloriesQuotidiennes * 1.1) {
    recommandations.push('Mangez moins');
  }
  
  return recommandations;
};

module.exports = {
  calculerTotalJournalier,
  verifierGoal,
  genererRecommandations
};
