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
    folder: 'produits', // optionnel : nom du dossier Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});
console.log("🔧 Cloudinary configuré avec :", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: "********" // ne jamais afficher
  });
module.exports = storage;
