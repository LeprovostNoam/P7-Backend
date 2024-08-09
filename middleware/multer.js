const multer = require('multer');
const crypto = require('crypto');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/png': 'png',
};

const fileFilter = (req, file, callback) => {
  const isValid = !!MIME_TYPES[file.mimetype];
  callback(isValid ? null : new Error('Invalid file type.'), isValid);
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    callback(null, `${uniqueSuffix}.${extension}`);
  }
});

module.exports = multer({ storage, fileFilter }).single('image');