const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require("../middleware/multer");
const sharp = require("../middleware/sharp");

const booksController = require('../controllers/books');


module.exports = router;

router.post("/", auth, multer, sharp, booksController.createBook);
router.get("/", booksController.getAllBooks);
router.get("/:id", booksController.getOneBook);
router.put("/:id", auth, multer, sharp, booksController.modifyBook);
router.delete("/:id", auth, booksController.deleteBook);