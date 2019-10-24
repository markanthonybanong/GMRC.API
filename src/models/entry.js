const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const entrySchema = new Schema({
  tenant: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
    }],
  },
  roomType: {
    type: String,
    trim: true,
    required: true,
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


