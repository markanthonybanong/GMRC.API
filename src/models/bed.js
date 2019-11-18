const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {DeckStatuses} = require('../core/enums/deckStatus');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const bedSchema = new Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  number: {
    type: Number,
    trim: true,
    required: true,
  },
  decks: [{
    number: {
      type: Number,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      trim: true,
      enum: Object.values(DeckStatuses),
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
    },
    dueRentDate: {
      type: Number,
      trim: true,
    },
    monthlyRent: {
      type: Number,
      trim: true,
    },
    away: [{
      willReturnIn: {
        type: Date,
        trim: true,
      },
      status: {
        type: String,
        trim: true,
        enum: Object.values(DeckStatuses),
      },
      inDate: {
        type: Date,
        trim: true,
      },
      inTime: {
        type: String,
        trim: true,
      },
      outDate: {
        type: Date,
        trim: true,
      },
      outTime: {
        type: String,
        trim: true,
      },
      dueRentDate: {
        type: Number,
        trim: true,
      },
      rent: {
        type: Number,
        trim: true,
      },
      tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
      },
    }],
  }],
}, {timestamps: {createdAt: 'created_at'}});
bedSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('Bed', bedSchema);
