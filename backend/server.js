const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const path = require('path');
require('dotenv').config();

// 🔓 Autorise ton frontend React Render
const allowedOrigins = [
  'https://databasefamilly-1.onrender.com', // ton vrai frontend Render
  'http://localhost:3000'                   // pour développement local
];

// CONFIGURATION CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// 🔍 Pour lire le body en JSON
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/produits', require('./routes/produits'));
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static(path.join(__dirname, '../frontend/public')));
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static(path.join(__dirname, '../frontend/public')));
app.use(express.json());

// ✅ Route d'inscription
app.post('/api/auth/register', (req, res) => {
  const { nom, prenom, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  // 🔐 À remplacer par un enregistrement réel en base de données
  console.log('Nouvel utilisateur enregistré :', { nom, prenom, email });

  res.status(201).json({ message: 'Inscription réussie' });
});

// ✅ Lancement du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
  
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});