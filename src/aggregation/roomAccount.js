/* eslint-disable max-len */
const RoomAccount = require('../models/roomAccount');
const {FilterType} = require('../core/enums/filterType');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;

/**
 * Aggregate the rooms collection.
 * @param {object} filter the object that contains the filter information.
 * @return {object} moongose agregated object.
 */
function aggregate(filter) {
  const aggregate = RoomAccount.aggregate();
  switch (filter.type) {
    case FilterType.ALLROOMACCOUNTS:
      aggregate.sort({
        roomNumber: 1,
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.ROOMACCOUNTBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.roomAccountObjectId),
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.ROOMACCOUNTBYROOMNUMBER:
      aggregate.match({
        roomNumber: filter.roomNumber,
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
