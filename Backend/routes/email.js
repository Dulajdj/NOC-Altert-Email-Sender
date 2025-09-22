const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const RecipientGroup = require('../models/RecipientGroup');
const generateHtml = require('../utils/emailTemplate');
const jwt = require('jsonwebtoken');

// JWT authentication middleware
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

// Fetch all group names
router.get('/groups', auth, async (req, res) => {
  try {
    const groups = await RecipientGroup.find().select('name');
    res.json(groups.map(g => g.name));
  } catch (err) {
    console.error('Fetch groups error:', err);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Fetch single group details
router.get('/groups/:groupName', auth, async (req, res) => {
  try {
    const group = await RecipientGroup.findOne({ name: req.params.groupName });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json({ to: group.to, cc: group.cc });
  } catch (err) {
    console.error('Fetch group details error:', err);
    res.status(500).json({ error: 'Failed to fetch group details' });
  }
});

// Send email
router.post('/send', auth, async (req, res) => {
  try {
    const data = req.body;
    console.log('Received send request with data:', data);

    // Validate required fields
    const requiredFields = ['recipient_group', 'trigger_name', 'host_name', 'host_ip'];
    for (let field of requiredFields) {
      if (!data[field]) return res.status(400).json({ error: `${field} is required` });
    }

    const group = await RecipientGroup.findOne({ name: data.recipient_group });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    // Check email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: 'Email configuration not found' });
    }

    const html = generateHtml(data);

    // Nodemailer transporter for Office 365 + MFA App Password
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // use STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
      },
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      }
    });

    // Send email (split multiple recipients by ';')
    await transporter.sendMail({
      from: `"NOC Team" <${process.env.EMAIL_USER}>`,
      to: group.to.split(';'),
      cc: group.cc.split(';'),
      subject: data.trigger_name,
      html
    });

    res.json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ error: err.message || 'Failed to send email' });
  }
});

module.exports = router;
