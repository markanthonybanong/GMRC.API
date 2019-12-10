const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const roomAccountSchema = new Schema({
  roomNumber: {
    type: Number,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
}, {timestamps: {createdAt: 'created_at'}});

roomAccountSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('RoomAccount', roomAccountSchema);


