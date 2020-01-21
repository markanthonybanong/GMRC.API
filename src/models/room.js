const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {RoomTypes} = require('../core/enums/roomTypes');
const {RoomStatuses} = require('../core/enums/roomStatus');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const roomSchema = new Schema({
  number: {
    type: Number,
    unique: true,
    required: true,
    trim: true,
  },
  floor: {
    type: Number,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
    enum: Object.values(RoomTypes),
    required: true,
  },
  aircon: {
    type: String,
    trim: true,
  },
  roomProperties: [{
    status: {
      type: String,
      trim: true,
      enum: Object.values(RoomStatuses),
      required: true,
    },
    dueRentDate: {
      type: Number,
      trim: true,
    },
    monthlyRent: {
      type: Number,
      trim: true,
    },
    riceCookerBill: {
      type: Number,
      trim: true,
    },
    tenants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
    }],
  }],
  bedspaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed',
  }],
}, {timestamps: {createdAt: 'created_at'}});

roomSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('Room', roomSchema);


