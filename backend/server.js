const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const path = require('path');
require('dotenv').config();

// CONFIGURATION CORS
app.use(cors({
    origin: 'http://localhost:5173', // ou le port ou tourne ton frontend Vite
    credentials: true,
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/produits', require('./routes/produits'));
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static(path.join(__dirname, '../frontend/public')));
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static(path.join(__dirname, '../frontend/public')));

const PORT = process.env.PORT || 3001;
app.get('/', (req, res) => {
    res.send('API en ligne !');
  });
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
  });