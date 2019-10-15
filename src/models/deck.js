const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {DeckStatuses} = require('../core/enums/deckStatus');

const deckSchema = new Schema({
  number: {
    type: Number,
    trim: true,
    unique: true,
    required: true,
    select: false,
  },
  status: {
    type: String,
    trim: true,
    enum: Object.values(DeckStatuses),
    required: true,
    select: false,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjecId,
    ref: 'Tenant',
    select: false,
  },
  isAway: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Away',
    select: false,
  },
}, {timestamps: {createdAt: 'created_at'}});

module.exports = mongoose.model('Deck', deckSchema);
