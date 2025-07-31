const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const authenticateToken = require('../middlewares/authenticateToken');

// Local
// const storage = multer.diskStorage({
//     destination: 'uploads/',
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         cb(null, Date.now() + ext);
//     },
// });

const storage = require('../utils/cloudinaryStorage');

const uploads = multer({ storage });

router.post('/add', uploads.single('image'), async (req, res) => {
  console.log("FICHIER REÇU :", req.file);
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ DÉSTRUCTURATION D'ABORD
    const { titre, prix, date_achat } = req.body;

    // ✅ Ensuite, parseFloat
    const prixFloat = parseFloat(prix);
    if (isNaN(prixFloat)) {
      return res.status(400).json({ error: 'Le prix doit être un nombre valide.' });
    }

    const image_url = req.file?.path || `${req.protocol}://${req.get('host')}/static/default-image.jpg`;
    console.log("📸 Image reçue :", req.file);
    await pool.query(
      'INSERT INTO produits (utilisateur_id, titre, prix, image_url, date_achat) VALUES ($1, $2, $3, $4, $5)',
      [decoded.userId, titre, prixFloat, image_url, date_achat]
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
        console.log("📸 Image reçue :", req.file);
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
  
  const prixFloat = parseFloat(prix);
  const prixReventeFloat = prix_revente ? parseFloat(prix_revente) : null;

  if (isNaN(prixFloat)) {
    return res.status(400).json({ error: 'Le prix doit être un nombre valide.' });
  }
  if (prix_revente && isNaN(prixReventeFloat)) {
    return res.status(400).json({ error: 'Le prix de revente doit être un nombre valide.' });
  }

  try {
    let image_url = null;
    if (req.file) {
      image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      console.log("📸 Image reçue :", req.file);
      await pool.query(
        'UPDATE produits SET titre=$1, prix=$2, prix_revente=$3, date_achat=$4, date_vente=$5, image_url=$6 WHERE id=$7',
        [titre, prix, prix_revente, date_achat, date_vente, image_url, id]
      );
    } else {
      console.log("📸 Image reçue :", req.file);
      await pool.query(
        'UPDATE produits SET titre=$1, prix=$2, prix_revente=$3, date_achat=$4, date_vente=$5 WHERE id=$6',
        [titre, prix, prix_revente, date_achat, date_vente, id]
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