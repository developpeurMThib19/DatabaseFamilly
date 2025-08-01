const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const adminRoutes = require('./routes/admin');
const app = express();

// 🔓 Origines autorisées (frontend React)
const allowedOrigins = [
  'https://databasefamilly.onrender.com',
  'http://localhost:3000',
];

// ✅ Middleware CORS (DOIT être avant toutes les routes)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

//app.options('*', cors());

// ✅ Middleware pour parser les JSON
app.use(express.json());

app.use((req, res, next) => {
  next();
});

app.use(express.urlencoded({ extended: true }));

// ✅ Servir les fichiers statiques (comme default-image.jpg)
app.use('/static', express.static(path.join(__dirname, 'static')));

// ⬇️ Tes autres middlewares, routes, etc.
const produitsRouter = require('./routes/produits');
app.use('/api/produits', produitsRouter);


// ✅ Routes API
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/produits', require('./routes/produits'));

// ✅ Fichiers statiques
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static(path.join(__dirname, '../frontend/public')));

// ✅ Test route directe (facultative si elle est déjà dans /routes/auth)
app.post('/api/auth/register', (req, res) => {
  const { nom, prenom, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  res.status(201).json({ message: 'Inscription réussie' });
});

app.use('/api/admin', adminRoutes);

// ✅ Lancer le serveur (une seule fois !)
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/api/auth', authRoutes);
app.use('/api/produits', require('./routes/produits'));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });