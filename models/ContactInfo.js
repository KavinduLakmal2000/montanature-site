const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema({
  address: String,
  emails: [String],
  hours: {
    weekdays: String,
    saturday: String
  },
  receiveEmail: String,
  locationLink: String // ← NEW
}, { collection: "contactInfo" });

module.exports = mongoose.model("ContactInfo", contactInfoSchema);
