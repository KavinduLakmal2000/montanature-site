const mongoose = require("mongoose");

const headingSchema = new mongoose.Schema({
  heading: String,
  description: String
});

module.exports = mongoose.model("ContactHead", headingSchema);
