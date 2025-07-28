const mongoose = require("mongoose");

const env_pro = new mongoose.Schema({
  siteValue: String,
  eggValue: String
});

module.exports = mongoose.model("env", env_pro);
