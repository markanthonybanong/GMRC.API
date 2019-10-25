const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const entrySchema = new Schema({
  roomNumber: {
    type: Number,
    trim: true,
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
  },
  monthlyRent: {
    type: Number,
    trim: true,
    required: true,
  },
  key: {
    type: String,
    trim: true,
    required: true,
  },
  dateEntry: {
    type: Date,
    trim: true,
    required: true,
  },
  dateExit: {
    type: Date,
    trim: true,
  },
  oneMonthDeposit: {
    type: String,
    trim: true,
    required: true,
  },
  oneMonthDepositBalance: [{
    balance: {
      type: Number,
      trim: true,
    },
  }],
  oneMonthAdvance: {
    type: String,
    trim: true,
    required: true,
  },
  oneMonthAdvanceBalance: [{
    balance: {
      type: Number,
      trim: true,
    },
  }],
}, {timestamps: {createdAt: 'created_at'}});

entrySchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('Entry', entrySchema);


