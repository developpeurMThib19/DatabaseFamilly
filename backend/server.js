const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const path = require('path');
require('dotenv').config();
const allowedOrigins = [
  'http://localhost:3000',
  'https://ton-site-vite.onrender.com',
]

// CONFIGURATION CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/produits', require('./routes/produits'));
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static(path.join(__dirname, '../frontend/public')));
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static(path.join(__dirname, '../frontend/public')));
app.use(express.json());

app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  // Exemple simple (à adapter avec ta base de données réelle)
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  // À remplacer par une insertion en base (ex: PostgreSQL)
  console.log('Nouvel utilisateur :', { email, password });

  res.status(201).json({ message: 'Utilisateur créé avec succès' });
});

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('API en ligne !');
  });
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
  });