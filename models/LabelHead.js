const mongoose = require("mongoose");

const labelHeadSchema = new mongoose.Schema({
  mainHeading: String,
  description: String
});

module.exports = mongoose.model("LabelHead", labelHeadSchema);
