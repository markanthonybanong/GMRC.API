const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const superAdminUserSchema = new Schema({
  type: {
    type: String,
    trim: true,
    default: 'Super Admin',
  },
  password: {
    type: String,
    trim: true,
  },

}, {timestamps: {createdAt: 'created_at'}});

module.exports = mongoose.model('SuperAdminUser', superAdminUserSchema);
