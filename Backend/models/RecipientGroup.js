const mongoose = require('mongoose');

const recipientGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  to: { type: String, required: true },
  cc: { type: String }
});

module.exports = mongoose.model('RecipientGroup', recipientGroupSchema);