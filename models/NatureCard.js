// models/nature_cards.js
const mongoose = require('mongoose');

const natureCardSchema = new mongoose.Schema({
  title: String,
  icon: String,
  subheading: String,
  description: String,
  link: String 
});

module.exports = mongoose.model('NatureCard', natureCardSchema);
