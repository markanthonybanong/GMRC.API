const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const {RoomTypes} = require('../core/enums/roomTypes');
 
const unsettleBillSchema = new Schema({
  roomNumber: {
    type: Number,
    trim: true,
    required: true,
  },
  roomType: {
    type: String,
    trim: true,
    enum: Object.values(RoomTypes),
    required: true,
  },
  tenants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
  }],
  dueDate: {
    type: Number,
    trim: true,
  },
  dateExit: {
    type: Date,
    trim: true,
  },
  rentBalance: {
    type: Number,
    trim: true,
  },
  electricBillBalance: {
    type: Number,
    trim: true,
  },
  waterBillBalance: {
    type: Number,
    trim: true,
  },
  riceCookerBillBalance: {
    type: Number,
    trim: true,
  },
}, {timestamps: {createdAt: 'created_at'}});

unsettleBillSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('UnsettleBill', unsettleBillSchema);


