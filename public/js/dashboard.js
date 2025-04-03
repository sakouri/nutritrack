window.initDashboard = async function() {
    await Promise.all([
        loadUserGoals(),
        loadMeals(),
        updateProgressBars()
    ]);
};

async function loadUserGoals() {
    try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/utilisateurs/${userId}/goals`);
        
        if (!response.ok) throw new Error('Erreur de chargement des objectifs');
        
        const goals = await response.json();
        if (goals) {
            updateGoalsDisplay(goals);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function loadMeals() {
    try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/meals/utilisateur/${userId}`);
        
        if (!response.ok) throw new Error('Erreur de chargement des repas');
        
        const data = await response.json();
        updateMealsList(data.meals);
        updateProgressBars(data.total);
        generateRecommendations(data.total);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function updateGoalsDisplay(goals) {
    document.getElementById('caloriesValue').textContent = `0/${goals.caloriesQuotidiennes} kcal`;
    document.getElementById('proteinesValue').textContent = `0/${goals.proteinesQuotidiennes} g`;
    document.getElementById('glucidesValue').textContent = `0/${goals.glucidesQuotidiens} g`;
    document.getElementById('lipidesValue').textContent = `0/${goals.lipidesQuotidiens} g`;
}

function updateProgressBars(total = { calories: 0, proteines: 0, glucides: 0, lipides: 0 }) {
    const goals = {
        calories: parseInt(document.getElementById('caloriesValue').textContent.split('/')[1]),
        proteines: parseInt(document.getElementById('proteinesValue').textContent.split('/')[1]),
        glucides: parseInt(document.getElementById('glucidesValue').textContent.split('/')[1]),
        lipides: parseInt(document.getElementById('lipidesValue').textContent.split('/')[1])
    };

    updateProgress('calories', total.calories, goals.calories);
    updateProgress('proteines', total.proteines, goals.proteines);
    updateProgress('glucides', total.glucides, goals.glucides);
    updateProgress('lipides', total.lipides, goals.lipides);
}

function updateProgress(nutrient, current, goal) {
    const progressBar = document.getElementById(`${nutrient}Progress`);
    const valueDisplay = document.getElementById(`${nutrient}Value`);
    const percentage = Math.min((current / goal) * 100, 100);
    
    progressBar.style.width = `${percentage}%`;
    progressBar.style.backgroundColor = percentage > 100 ? 'var(--error-color)' : 'var(--primary-color)';
    valueDisplay.textContent = `${current}/${goal} ${nutrient === 'calories' ? 'kcal' : 'g'}`;
}

function updateMealsList(meals) {
    const mealsList = document.getElementById('mealsList');
    mealsList.innerHTML = '';
    
    meals.forEach(meal => {
        const mealElement = document.createElement('div');
        mealElement.className = 'meal-item';
        mealElement.innerHTML = `
            <div>
                <strong>${meal.nom}</strong>
                <div>${meal.calories} kcal</div>
            </div>
            <div>
                <small>P: ${meal.proteines}g</small>
                <small>G: ${meal.glucides}g</small>
                <small>L: ${meal.lipides}g</small>
            </div>
        `;
        mealsList.appendChild(mealElement);
    });
}

function generateRecommendations(total) {
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    
    const goals = {
        calories: parseInt(document.getElementById('caloriesValue').textContent.split('/')[1]),
        proteines: parseInt(document.getElementById('proteinesValue').textContent.split('/')[1]),
        glucides: parseInt(document.getElementById('glucidesValue').textContent.split('/')[1]),
        lipides: parseInt(document.getElementById('lipidesValue').textContent.split('/')[1])
    };

    const recommendations = [];
    
    if (total.calories < goals.calories * 0.5) {
        recommendations.push('Mangez plus');
    }
    
    if (total.proteines < goals.proteines * 0.7) {
        recommendations.push('Augmentez votre apport en protéines');
    }
    
    if (total.calories > goals.calories * 1.1) {
        recommendations.push('Mangez moins');
    }

    recommendations.forEach(rec => {
        const recElement = document.createElement('div');
        recElement.className = 'recommendation-item';
        recElement.textContent = rec;
        recommendationsList.appendChild(recElement);
    });
}

document.getElementById('addMealForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('/api/meals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                utilisateurId: localStorage.getItem('userId'),
                nom: formData.get('nom'),
                calories: Number(formData.get('calories')),
                proteines: Number(formData.get('proteines')),
                glucides: Number(formData.get('glucides')),
                lipides: Number(formData.get('lipides'))
            })
        });

        if (!response.ok) throw new Error('Erreur d\'ajout du repas');
        
        e.target.reset();
        await loadMeals();
    } catch (error) {
        alert('Erreur lors de l\'ajout du repas: ' + error.message);
    }
});

document.getElementById('updateGoalsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/utilisateurs/${userId}/goals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                caloriesQuotidiennes: Number(formData.get('caloriesQuotidiennes')),
                proteinesQuotidiennes: Number(formData.get('proteinesQuotidiennes')),
                glucidesQuotidiens: Number(formData.get('glucidesQuotidiens')),
                lipidesQuotidiens: Number(formData.get('lipidesQuotidiens'))
            })
        });

        if (!response.ok) throw new Error('Erreur de màj des goals');
        
        const goals = await response.json();
        updateGoalsDisplay(goals);
        await loadMeals();
    } catch (error) {
        alert('Erreur lors de la maj des goals: ' + error.message);
    }
});
