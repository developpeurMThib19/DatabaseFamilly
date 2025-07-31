const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

console.log("🔧 Cloudinary storage ready :", typeof storage._handleFile); // doit être "function"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // bien corrigé ?
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("🔧 Cloudinary storage ready :", typeof storage._handleFile); // doit être "function"

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'produits',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});
console.log("🔧 Cloudinary storage ready :", typeof storage._handleFile); // doit être "function"

const uploads = multer({ storage });
