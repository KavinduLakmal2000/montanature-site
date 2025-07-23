// models/PageHeading.js
const mongoose = require("mongoose");

const pageHeadingSchema = new mongoose.Schema({
  mainHeading: String,
  description: String,
  statsNumber: String,     
  statsLabel: String       
});

module.exports = mongoose.model("PageHeading", pageHeadingSchema);
