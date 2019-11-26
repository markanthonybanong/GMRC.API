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
      type: Number,
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
  total: {
    type: Number,
    trim: true,
    required: true,
  },
  totalAmountElectricBill: {
    type: Number,
    trim: true,
    required: true,
  },
  riceCookerBillBalance: [{
    balance: {
      type: Number,
      trim: true,
    },
  }],
  riceCookerBillStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    required: true,
    trim: true,
  },
  riceCookerBill: {
    type: Number,
    trim: true,
    required: true,
  },
  roomNumber: {
    type: Number,
    required: true,
    trim: true,
  },
  waterBillBalance: [{
    balance: {
      type: Number,
      trim: true,
    },
  }],
  waterBillStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    required: true,
    trim: true,
  },
  waterBill: {
    type: Number,
    trim: true,
    required: true,
  },
  roomType: {
    type: String,
    trim: true,
    required: true,
  },
  roomTenants: [{
    dueRentDate: {
      type: Number,
      trim: true,
    },
    index: {
      type: Number,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    rentStatus: {
      value: {
        type: String,
        trim: true,
      },
      balance: {
        type: Number,
        trim: true,
      },
    },
    rent: {
      type: Number,
      trim: true,
    },
  }],
}, {timestamps: {createdAt: 'created_at'}});
roomPaymentSchema.index({
  date: 1,
  roomNumber: 1,
}, {
  unique: true,
});
roomPaymentSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('RoomPayment', roomPaymentSchema);


