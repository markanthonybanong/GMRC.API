/* eslint-disable max-len */
const Penalty = require('../models/penalty');
const {FilterType} = require('../core/enums/filterType');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
const paymentController = require('../controllers/payment');
/**
 * Aggregate the rooms collection.
 * @param {object} filter the object that contains the filter information.
 * @return {object} moongose agregated object.
 */
function aggregate(filter) {
  const aggregate = Penalty.aggregate();
  switch (filter.type) {
    case FilterType.ALLPENALTIES:
      aggregate.lookup({
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
    case FilterType.PENALTYBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.penaltyObjectId),
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
    case FilterType.ADVANCESEARCHPENALTY:
      delete filter.penaltyFilter.tenantName;
      aggregate.match({
        $and: [paymentController.setValueForPenaltySearchFilter(filter.penaltyFilter)],
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
