const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/register', async (req, res) => {
  let { nom, prenom, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  email = email.toLowerCase();

  const check = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

  if (check.rows.length > 0) {
    return res.status(409).json({ error: 'Cet email existe déjà.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(
      'INSERT INTO users (nom, prenom, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
      [nom, prenom, email, hashedPassword]
    );

    res.status(201).json({ message: 'Inscription réussie', id: result.rows[0].id });
  } catch (error) {
    console.error('Erreur DB :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/login', async (req, res) => {
  let { email, password } = req.body;
  
  email = email.toLowerCase();

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Email non trouvé' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    // ✅ Mise à jour des champs au moment de la connexion
    await pool.query(`
      UPDATE users
      SET 
        last_login = NOW(),
        login_time = NOW(),
        is_online = true,
        login_count = COALESCE(login_count, 0) + 1
      WHERE id = $1
    `, [user.id]);

    const token = jwt.sign(
      {
        userId: user.id,
        is_admin: user.is_admin,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Erreur lors de la connexion :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/logout', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    await pool.query(`
      UPDATE users
      SET 
        is_online = false,
        session_duration = NOW() - login_time
      WHERE id = $1
    `, [userId]);

    res.status(200).json({ message: 'Déconnexion réussie' });
  } catch (err) {
    console.error('Erreur lors de la déconnexion :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
