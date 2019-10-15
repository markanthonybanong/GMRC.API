const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {DeckStatuses} = require('../core/enums/deckStatus');
const bedSchema = new Schema({
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
    dueRent: {
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
      tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
      },
    }],
  }],
}, {timestamps: {createdAt: 'created_at'}});

module.exports = mongoose.model('Bed', bedSchema);
