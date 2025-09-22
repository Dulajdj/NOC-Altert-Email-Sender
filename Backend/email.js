const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const RecipientGroup = require("../models/RecipientGroup");
const generateHtml = require("../utils/emailTemplate");
const jwt = require("jsonwebtoken");

// ===== Auth Middleware =====
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ===== SMTP Transporter (Gmail) =====
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS, must be false for port 587
  auth: {
    user: process.env.EMAIL_USER, // full email address
    pass: process.env.EMAIL_PASS, // App password
  },
  tls: {
    rejectUnauthorized: true, // safer than false
  },
});

// ===== Verify SMTP connection at startup =====
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP config error:", error);
    console.error("📧 Email configuration issues:");
    console.error("1. Check EMAIL_USER and EMAIL_PASS in .env file");
    console.error("2. Ensure you're using App Password, not regular password");
    console.error("3. For Gmail: Enable 2FA and create App Password");
    console.error("4. For Office365: Create App Password in security settings");
  } else {
    console.log("✅ SMTP server ready to send emails");
  }
});

// ===== Get All Groups =====
router.get("/groups", auth, async (req, res) => {
  try {
    const groups = await RecipientGroup.find().select("name");
    res.json(groups.map((g) => g.name));
  } catch (err) {
    console.error("Fetch groups error:", err);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});

// ===== Send Email =====
router.post("/send", auth, async (req, res) => {
  try {
    const data = req.body;
    console.log("📩 Received send request:", data);

    if (!data.recipient_group) {
      return res.status(400).json({ error: "Recipient group is required" });
    }

    const group = await RecipientGroup.findOne({ name: data.recipient_group });
    if (!group) return res.status(404).json({ error: "Group not found" });

    const html = generateHtml(data);

    // Convert semicolons to commas for nodemailer
    const toEmails = group.to.replace(/;/g, ",");
    const ccEmails = group.cc.replace(/;/g, ",");

    console.log("📨 Sending email to:", toEmails, "cc:", ccEmails);

    const info = await transporter.sendMail({
      from: `"Critical Alert System" <${process.env.EMAIL_USER}>`,
      to: toEmails,
      cc: ccEmails,
      subject: data.trigger_name || "Incident Report",
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    res.json({ message: "Email sent!" });
  } catch (err) {
    console.error("❌ Send email error:", err);
    res.status(500).json({ error: "Failed to send email", details: err.message });
  }
});

module.exports = router;
