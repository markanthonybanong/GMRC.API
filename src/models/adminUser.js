const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {UserTypes} = require('../core/enums/userType');
const adminUserSchema = new Schema({
  type: {
    type: String,
    trim: true,
    default: UserTypes.ADMIN,
  },
  password: {
    type: String,
    trim: true,
  },

}, {timestamps: {createdAt: 'created_at'}});
adminUserSchema.index({'created_at': 1}, {expireAfterSeconds: 7140});
module.exports = mongoose.model('AdminUser', adminUserSchema);
