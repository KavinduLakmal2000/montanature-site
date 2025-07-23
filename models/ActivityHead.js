const mongoose = require("mongoose");

const activityHeadSchema = new mongoose.Schema({
  mainHeading: String,
  description: String
});

module.exports = mongoose.model("ActivityHead", activityHeadSchema);
