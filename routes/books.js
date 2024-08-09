const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require("../middleware/multer");
const sharp = require("../middleware/sharp");

const booksController = require('../controllers/books');


module.exports = router;

router.post("/", auth, multer, sharp, booksController.createBook);