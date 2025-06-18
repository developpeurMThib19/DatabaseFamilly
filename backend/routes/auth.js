const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { nom, prenom, email, password } = req.body;
    try {
      const hash = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (nom, prenom, email, password) VALUES ($1, $2, $3, $4) RETURNING id, email',
        [nom, prenom, email, hash]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error('❌ Erreur lors de l’inscription :', err); // <-- log complet
      res.status(500).json({ error: err.message });
    }
  });
  

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      if (!user) return res.status(400).json({ error: 'Identifiants invalides' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Identifiants invalides' });
  
      const token = jwt.sign({ userId: user.id, nom: user.nom, prenom: user.prenom, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      console.error('❌ Erreur lors de la connexion :', err); // ← ici
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;