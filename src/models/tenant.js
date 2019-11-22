const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {Genders} = require('../core/enums/gender');
const {TypeOfNetworks} = require('../core/enums/typeOfNetwork');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const tenantSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  middlename: {
    type: String,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  roomNumber: {
    type: Number,
    trim: true,
  },
  dueRentDate: {
    type: Number,
    trim: true,
  },
  age: {
    type: Number,
    trim: true,
  },
  gender: {
    type: String,
    trim: true,
    enum: Object.values(Genders),
    required: true,
  },
  typeOfNetwork: {
    type: String,
    trim: true,
    enum: Object.values(TypeOfNetworks),
    required: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
  emergencyContactNumber: {
    type: Number,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
}, {timestamps: {createdAt: 'created_at'}});

tenantSchema.index({firstname: 1, middlename: 1, lastname: 1}, {unique: true});
tenantSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('Tenant', tenantSchema);
