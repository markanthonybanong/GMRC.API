const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {RoomTypes} = require('../core/enums/roomTypes');
const {HasAircon} = require('../core/enums/hasAircon');
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
    required: true,
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
    enum: Object.values(HasAircon),
    required: true,
  },
  transientPrivateRoomProperties: [{
    status: {
      type: String,
      trim: true,
      enum: Object.values(RoomStatuses),
      required: true,
    },
    dueRent: {
      type: Number,
      trim: true,
    },
  }],
  bedspaces: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bed',
    }],
  },
  tenants: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
    }],
  },
}, {timestamps: {createdAt: 'created_at'}});

roomSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('Room', roomSchema);


