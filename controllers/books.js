const Book = require('../models/Book.js')
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/png': 'png',
  };
  
exports.createBook = (req, res, next) => {
    try {

        const bookObject = JSON.parse(req.body.book);

        const { title, author, year, genre, ratings, averageRating } = bookObject;

        if (!title || !author || !year || !genre || !ratings || averageRating === undefined) {
            return res.status(400).json({ message: "Tous les champs doivent être remplis." });
        }

        const currentYear = new Date().getFullYear();
        if (!/^\d{4}$/.test(year) || parseInt(year) > currentYear) {
            return res.status(400).json({ message: "L'année n\'est pas valide." });
        }

        if (typeof averageRating !== 'number' || averageRating < 1 || averageRating > 5) {
            return res.status(400).json({ message: "La note moyenne doit être un nombre entre 1 et 5." });
        }

        const fileMimeType = req.file.mimetype;
        if (!MIME_TYPES[fileMimeType]) {
            return res.status(400).json({ message: "Type de fichier non valide. Seuls les formats jpg, jpeg et png sont acceptés." });
        }

        delete bookObject._id;
        delete bookObject._userId;

        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        });

        book.save()
            .then(() => res.status(201).json({ message: "Le livre a été ajouté avec succès!" }))
            .catch((error) => next(error));

    } catch (error) {
        next(error);
    }
};
