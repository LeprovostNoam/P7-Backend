const express = require('express');
const router = express.Router();

router.post('/signup', (req, res) => {
  res.send('OK');
});

router.post('/login', (req, res) => {
    res.send('OK');
});

module.exports = router;
