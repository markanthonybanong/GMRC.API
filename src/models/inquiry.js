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
  },
  willOccupyIn: {
    type: Date,
    trim: true,
    required: true,
  },
  phoneNumber: {
    type: Number,
    trim: true,
  },
  gender: {
    type: String,
    trim: true,
  },
  roomType: {
    type: String,
    trim: true,
  },
  bedInfos: [{
    bedNumber: {
      type: Number,
      trim: true,
    },
    deckNumber: {
      type: Number,
      trim: true,
    },
  }],
}, {timestamps: {createdAt: 'created_at'}});

inquirySchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('Inquiry', inquirySchema);


