const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {DeckStatuses} = require('../core/enums/deckStatus');

const awaySchema = new Schema({
  returnedIn: {
    type: Date,
    trim: true,
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
  tenantName: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    select: false,
  },
  in: {
    type: String,
    trim: true,
    required: true,
    select: false,
  },
  out: {
    type: String,
    trim: true,
    required: true,
    select: false,
  },
}, {timestamps: {createdAt: 'created_at'}});

module.exports = mongoose.model('Away', awaySchema);
