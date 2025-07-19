const mongoose = require('mongoose');

const FooterSchema = new mongoose.Schema({
  address: String,
  telephone: String,
  email: String,
  facebook: String,
  instagram: String,
  linkedin: String,
  twitter: String
});

const Footer = mongoose.model('footer_data', FooterSchema); // Exact collection name

module.exports = Footer;
