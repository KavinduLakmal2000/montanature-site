const mongoose = require("mongoose");

const natureHeadSchema = new mongoose.Schema({
  mainHeading: String,
  description: String
});

module.exports = mongoose.model("NatureHead", natureHeadSchema);
