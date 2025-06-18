const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));