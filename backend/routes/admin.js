const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorizeAdmin = require('../middlewares/authorizeAdmin');

// Route protégée : accessible uniquement aux admins
router.get('/users', authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nom, prenom, email, last_login, is_online, session_duration, avatar_url, login_count
      FROM users
      ORDER BY last_login DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur récupération utilisateurs :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
