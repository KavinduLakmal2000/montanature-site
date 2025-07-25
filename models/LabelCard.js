// ./model/LabelCard.js
const mongoose = require("mongoose");

const labelCardSchema = new mongoose.Schema({
  stepNumber: { type: String, required: true },
  icon: { type: String, required: true },
  heading: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("LabelCard", labelCardSchema);
