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

router.get('/groups/:groupName', auth, async (req, res) => {
  try {
    const group = await RecipientGroup.findOne({ name: req.params.groupName });
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json({ to: group.to, cc: group.cc });
  } catch (err) {
    console.error('Fetch group details error:', err);
    res.status(500).json({ error: 'Failed to fetch group details' });
  }
});

router.post('/send', auth, async (req, res) => {
  try {
    const data = req.body;
    console.log('Received send request with data:', data);
    
    // Validate required fields
    if (!data.recipient_group) return res.status(400).json({ error: 'Recipient group is required' });
    if (!data.trigger_name) return res.status(400).json({ error: 'Trigger name is required' });
    if (!data.host_name) return res.status(400).json({ error: 'Host name is required' });
    if (!data.host_ip) return res.status(400).json({ error: 'Host IP is required' });
    
    const group = await RecipientGroup.findOne({ name: data.recipient_group });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    
    // Check if email configuration is available
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: 'Email configuration not found' });
    }
    
    const html = generateHtml(data);
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
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
    res.json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ error: err.message || 'Failed to send email' });
  }
});

module.exports = router;