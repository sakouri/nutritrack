
const authForms = document.getElementById('authForms');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const dashboard = document.getElementById('dashboard');
const logoutBtn = document.getElementById('logoutBtn');


showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});


document.getElementById('inscriptionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('/api/utilisateurs/inscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nom: formData.get('nom'),
                email: formData.get('email'),
                motDePasse: formData.get('motDePasse')
            })
        });

        if (!response.ok) throw new Error('Erreur d\'inscription');
        
        const data = await response.json();
        // connexion qd on s'inscrit
        handleLogin(formData.get('email'), formData.get('motDePasse'));
    } catch (error) {
        alert('Erreur lors de l\'inscription: ' + error.message);
    }
});

// connexion
document.getElementById('connexionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    handleLogin(formData.get('email'), formData.get('motDePasse'));
});

async function handleLogin(email, password) {
    try {
        const response = await fetch('/api/utilisateurs/connexion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                motDePasse: password
            })
        });

        if (!response.ok) throw new Error('Identifiants invalides');
        
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.utilisateur.id);
        localStorage.setItem('userName', data.utilisateur.nom);
        
        // afficher le dashboard
        authForms.classList.add('hidden');
        dashboard.classList.remove('hidden');

        window.initDashboard();
    } catch (error) {
        alert('Erreur de connexion: ' + error.message);
    }
}

// déconnexion
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    dashboard.classList.add('hidden');
    authForms.classList.remove('hidden');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
});

// vérifier si un user est déjà connecté
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    if (token) {
        authForms.classList.add('hidden');
        dashboard.classList.remove('hidden');
        window.initDashboard();
    }
});
