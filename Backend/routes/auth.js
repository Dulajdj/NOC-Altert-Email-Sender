const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });
    const user = new User({ username, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });
    const user = await User.findOne({ username });
    if (!user || !await user.comparePassword(password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;