const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'produits',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// ✅ Ce log doit venir **après** l'initialisation
console.log("🔧 Cloudinary storage ready :", typeof storage._handleFile); // doit être "function"

module.exports = storage;
