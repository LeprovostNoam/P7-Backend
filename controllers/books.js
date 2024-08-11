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

exports.getAllBooks = (req, res, next) => {
	Book.find()
		.then((books) => res.status(200).json(books))
		.catch((error) => next(error));
};

exports.getOneBook = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((books) => res.status(200).json(books))
		.catch((error) => next(error));
};

exports.modifyBook = async (req, res, next) => {
	try {
		const book = await Book.findOne({ _id: req.params.id });

		if (!book) {
			return res.status(404).json({ message: "Aucun livre trouvé." });
		}

		if (book.userId != req.auth.userId) {
			return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce livre." });
		}

		const bookObject = req.file
			? {
					...JSON.parse(req.body.book),
					imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
			  }
			: { ...req.body };

		delete bookObject._userId;

		if (req.file) {
			const oldFilename = book.imageUrl.split("/images/")[1];
			fs.unlink(`images/${oldFilename}`, (err) => {
				if (err) {
					console.error("Erreur lors de la suppression de l'ancienne image :", err);
				}
			});
		}

		await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });

		res.status(200).json({ message: "Livre modifié avec succès !" });
	} catch (error) {
		console.error("Erreur lors de la modification du livre :", error);
		next(error);
	}
};

exports.deleteBook = async (req, res, next) => {
	try {
		const book = await Book.findOne({ _id: req.params.id });
		if (!book) {
			return res.status(404).json({ message: "Livre non trouvé." });
		}
		if (book.userId.toString() !== req.auth.userId) {
			return res.status(401).json({ message: "Vous n'avez pas la permission de supprimer ce livre." });
		}

		const filename = book.imageUrl.split("/images/")[1];
		fs.unlink(`images/${filename}`, async (err) => {
			if (err) {
				return res.status(500).json({ error: err.message });
			}

			await Book.deleteOne({ _id: req.params.id });
			res.status(200).json({ message: "Le livre à été supprimé avec succès." });
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};