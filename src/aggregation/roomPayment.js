/* eslint-disable max-len */
const RoomPayment = require('../models/roomPayment');
const {FilterType} = require('../core/enums/filterType');
const paymentController = require('../controllers/payment');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
/**
 * Aggregate the rooms collection.
 * @param {object} filter the object that contains the filter information.
 * @return {object} moongose agregated object.
 */
function aggregate(filter) {
  const aggregate = RoomPayment.aggregate();
  switch (filter.type) {
    case FilterType.ROOMPAYMENTBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.roomPaymentObjectId),
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
  }
  return aggregate;
}

module.exports = aggregate;
