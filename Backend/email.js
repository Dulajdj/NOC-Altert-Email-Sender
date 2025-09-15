const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const RecipientGroup = require('../models/RecipientGroup');
const generateHtml = require('../utils/emailTemplate');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/groups', auth, async (req, res) => {
  try {
    const groups = await RecipientGroup.find().select('name');
    res.json(groups.map(g => g.name));
  } catch (err) {
    console.error('Fetch groups error:', err);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

router.post('/send', auth, async (req, res) => {
  try {
    const data = req.body;
    console.log('Received send request with data:', data);
    if (!data.recipient_group) return res.status(400).json({ error: 'Recipient group is required' });
    const group = await RecipientGroup.findOne({ name: data.recipient_group });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    const html = generateHtml(data);
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // Disable certificate validation (development only)
      }
    });
    console.log('Sending email to:', group.to, 'cc:', group.cc);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: group.to,
      cc: group.cc,
      subject: data.trigger_name || 'Incident Report',
      html
    });
    res.json({ message: 'Email sent!' });
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;