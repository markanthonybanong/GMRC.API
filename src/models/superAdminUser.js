const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {UserTypes} = require('../core/enums/userType');

const superAdminUserSchema = new Schema({
  type: {
    type: String,
    trim: true,
    default: UserTypes.SUPERADMIN,
  },
  password: {
    type: String,
    trim: true,
  },

}, {timestamps: {createdAt: 'created_at'}});

module.exports = mongoose.model('SuperAdminUser', superAdminUserSchema);
