const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const {PaymentStatus} = require('../core/enums/paymentStatus');
const roomPaymentSchema = new Schema({
  amountKWUsed: {
    type: Number,
    required: true,
    trim: true,
  },
  date: {
    type: String,
    trim: true,
    required: true,
  },
  electricBillBalance: [{
    balance: {
      type: number,
      trim: true,
    },
  }],
  electricBillStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    trim: true,
    required: true,
  },
  presentReading: {
    type: Date,
    trim: true,
    required: true,
  },
  presentReadingKWUsed: {
    type: Number,
    trim: true,
    required: true,
  },
  previousReading: {
    type: Date,
    trim: true,
    required: true,
  },
  previousReadingKWUsed: {
    type: Number,
    trim: true,
    required: true,
  },
  riceCookerBillBalance: [{
    balance: {
      type: number,
      trim: true,
    },
  }],
  riceCookerBillStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    required: true,
    trim: true,
  },
  roomNumber: {
    type: Number,
    required: true,
    trim: true,
  },
  waterBillBalance: [{
    balance: {
      type: number,
      trim: true,
    },
  }],
  waterBillStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    required: true,
    trim: true,
  },
}, {timestamps: {createdAt: 'created_at'}});

roomPaymentSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('RoomPayment', roomPaymentSchema);


