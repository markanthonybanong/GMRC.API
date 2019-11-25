/* eslint-disable max-len */
const UnsettleBill = require('../models/unsettleBill');
const {FilterType} = require('../core/enums/filterType');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
/**
 * Aggregate the rooms collection.
 * @param {object} filter the object that contains the filter information.
 * @return {object} moongose agregated object.
 */
function aggregate(filter) {
  const aggregate = UnsettleBill.aggregate();
  switch (filter.type) {
    case FilterType.ALLUNSETTLEBILLS:
      aggregate.lookup({
        from: 'tenants',
        localField: 'tenants',
        foreignField: '_id',
        as: 'tenants',
      }).sort({
        roomNumber: 1,
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.UNSETTLEBILLBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.unsettleBillObjectId),
      }).lookup({
        from: 'tenants',
        localField: 'tenants',
        foreignField: '_id',
        as: 'tenants',
      }).sort({
        roomNumber: 1,
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.ADVANCESEARCHENTRY:
      aggregate.match({
        $and: [
          paymentController.setValueForEntrySearchFilter(filter.entryFilter),
        ],
      }).lookup({
        from: 'tenants',
        localField: 'tenant',
        foreignField: '_id',
        as: 'tenant',
      }).sort({
        roomNumber: 1,
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
