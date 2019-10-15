const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const {Genders} = require('../core/enums/gender');
const {RoomTypes} = require('../core/enums/roomTypes');
const inquirySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  roomNumber: {
    type: Number,
    trim: true,
    required: true,
  },
  howDidYouFindUs: {
    type: String,
    trim: true,
    required: true,
  },
  willOccupyIn: {
    type: Date,
    trim: true,
    required: true,
  },
  phoneNumber: {
    type: Number,
    trim: true,
    required: true,
  },
  gender: {
    type: String,
    trim: true,
    enum: Object.values(Genders),
    required: true,
  },
  roomType: {
    type: String,
    trim: true,
    enum: Object.values(RoomTypes),
    required: true,
  },
  deckNumbers: [{
    number: {
      type: Number,
      trim: true,
    },
  }],
}, {timestamps: {createdAt: 'created_at'}});

inquirySchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('Inquiry', inquirySchema);


