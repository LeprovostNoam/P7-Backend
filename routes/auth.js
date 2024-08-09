const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/signup', async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Veuillez saisir une adresse email et un mot de passe.' });
  }

  email = email.toLowerCase();

  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Adresse email non valide.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'L\'adresse email est déjà utilisée.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: 'L\'utilisateur a été créé avec succès.' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
