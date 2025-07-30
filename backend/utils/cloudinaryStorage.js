// utils/cloudinaryStorage.js
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'produits', // dossier dans ton Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

module.exports = storage;