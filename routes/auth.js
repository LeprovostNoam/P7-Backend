const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

router.post('/login', async (req, res) => {
    let { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Veuillez saisir une adresse email et un mot de passe.' });
    }
  
    email = email.toLowerCase();
  
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Adresse email non valide.' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Adresse email ou mot de passe incorrect.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: 'Adresse email ou mot de passe incorrect.' });
      }
  
      const token = jwt.sign(
        { userId: user._id },
        process.env.TOKEN_KEY,
        { expiresIn: '4h' }
      );
  
      // Réponse avec l'ID utilisateur et le token
      res.status(200).json({
        userId: user._id,
        token: token,
      });
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

module.exports = router;
