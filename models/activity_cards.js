// models/activity_cards.js
const mongoose = require('mongoose');

const activityCardSchema = new mongoose.Schema({
  title: String,
  category: String,
  image: String,
  description: String,
  lightbox: String
});

module.exports = mongoose.model('ActivityCard', activityCardSchema);
