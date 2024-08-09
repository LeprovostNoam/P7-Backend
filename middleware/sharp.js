const sharp = require('sharp');
const fs = require('fs').promises;

const compressImage = async (req, res, next) => {
  if (req.file) {
    try {
      const originalPath = req.file.path;
      const newFilename = req.file.filename.replace(/\.[^.]+$/, ".webp");
      const newPath = `images/${newFilename}`;

      await sharp(originalPath)
        .webp({ quality: 50 })
        .toFile(newPath);

      await fs.unlink(originalPath);

      req.file.path = newPath;
      req.file.filename = newFilename;
      req.file.mimetype = "image/webp";

    } catch (error) {
      return res.status(500).json({ message: 'Intenal Server Error' });
      console.log(error);
    }
  }
  next();
};

module.exports = compressImage;
