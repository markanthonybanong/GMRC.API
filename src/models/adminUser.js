const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminUserSchema = new Schema({
  type: {
    type: String,
    trim: true,
    default: 'Admin',
  },
  password: {
    type: String,
    trim: true,
  },

}, {timestamps: {createdAt: 'created_at'}});
adminUserSchema.index({'created_at': 1}, {expireAfterSeconds: 180});
module.exports = mongoose.model('AdminUser', adminUserSchema);
