const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const penaltySchema = new Schema({
  roomNumber: {
    type: Number,
    trim: true,
  },
  date: {
    type: Date,
    trim: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
  },
  fine: {
    type: Number,
    trim: true,
  },
  violation: {
    type: String,
    trim: true,
  },
}, {timestamps: {createdAt: 'created_at'}});

penaltySchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('Penalty', penaltySchema);


