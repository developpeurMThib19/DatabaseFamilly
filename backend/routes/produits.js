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

const multer = require('multer');
const storage = require('../utils/cloudinaryStorage');
const uploads = multer({ storage });

router.post('/add', uploads.single('image'), async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { titre, prix, date_achat } = req.body;

    // ✅ Adapté pour Cloudinary : req.file?.path contient l’URL hébergée
    // ✅ Si Cloudinary renvoie une image, on l'utilise, sinon image par défaut
    const image_url = req.file?.path || `${req.protocol}://${req.get('host')}/static/default-image.jpg`;

    await pool.query(
      'INSERT INTO produits (utilisateur_id, titre, prix, image_url, date_achat) VALUES ($1, $2, $3, $4, $5)',
      [decoded.userId, prix, titre, image_url, date_achat]  // <- vérifie l’ordre si besoin
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

router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM produits WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Produit introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur get produit :', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/update', uploads.single('image'), authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { titre, prix, prix_revente, date_achat, date_vente } = req.body;
  
  try {
    let image_url = null;
    if (req.file) {
      image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      await pool.query(
        'UPDATE produits SET titre=$1, prix=$2, prix_revente=$3, date_achat=$4, date_vente=$5, image_url=$6 WHERE id=$7',
        [titre, prix, prix_revente, date_achat, date_vente, image_url, id]
      );
    } else {
      await pool.query(
        'UPDATE produits SET titre=$1, prix=$2, prix_revente=$3, date_achat=$4, date_vente=$5, image_url=$6 WHERE id=$7',
        [titre, prix, prix_revente, date_achat, date_vente, image_url, id]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Erreur update produit :', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/delete', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM produits WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur suppression produit :", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;