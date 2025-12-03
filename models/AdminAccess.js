const mongoose = require('mongoose');

const AdminAccessSchema = new mongoose.Schema({
  value: { type: Boolean, required: true }
});

module.exports = mongoose.model('AdminAccess', AdminAccessSchema, 'AdminAccess');
 