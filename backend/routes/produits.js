const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const authenticateToken = require('../middlewares/authenticateToken');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});

const uploads = multer({ storage });

router.post('/add', uploads.single('image'), async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { titre, prix, date_achat } = req.body;

    // Si pas d'image, on peut mettre une image par défaut ou null
    const image_url = req.file
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    : `${req.protocol}://${req.get('host')}/static/default-image.jpg`;

    await pool.query(
      'INSERT INTO produits (utilisateur_id, titre, prix, image_url, date_achat) VALUES ($1, $2, $3, $4, $5)',
      [decoded.userId, titre, prix, image_url, date_achat]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Erreur ajout produit :', err);
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id/vendu', authenticateToken, async (req, res) => {
  const produitId = req.params.id;
  const { prix_revente } = req.body;

  try {
    await pool.query(
      'UPDATE produits SET vendu = true, prix_revente = $1 WHERE id = $2',
      [prix_revente, produitId]
    );
    res.json({ message: '✅ Produit vendu avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
  }
});


router.get('/historique', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token manquant' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await pool.query(
        'SELECT * FROM produits WHERE utilisateur_id = $1 ORDER BY date_achat DESC',
        [decoded.userId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Erreur historique :', err);
      res.status(500).json({ error: err.message });
    }
  });
  

router.get('/', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token manquant' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decoded;

        const result = await pool.query(
            'SELECT id, titre, prix, prix_revente, image_url, date_achat, vendu FROM produits WHERE utilisateur_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.log('Erreur récupération produits :', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;