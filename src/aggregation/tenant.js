/* eslint-disable max-len */
const Tenant = require('../models/tenant');
const {FilterType} = require('../core/enums/filterType');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
/**
 * Aggregate the rooms collection.
 * @param {object} filter the object that contains the filter information.
 * @return {object} moongose agregated object.
 */
function aggregate(filter) {
  const aggregate = Tenant.aggregate();
  switch (filter.type) {
    case FilterType.ALLTENANTS: {
      aggregate.sort({
        roomNumber: 1,
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    }
    case FilterType.TENANTBYKEYSTROKE:
      aggregate.match({
        $or: [
          {firstname: {$regex: filter.tenantName, $options: 'i'}},
          {middlename: {$regex: filter.tenantName, $options: 'i'}},
          {lastname: {$regex: filter.tenantName, $options: 'i'}},
        ],
      });
      break;
    case FilterType.TENANTBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.tenantObjectId),
      });
      break;
    case FilterType.ADVANCESEARCHTENANT:
      aggregate.match(filter.tenantFilter);
      break;
  }
  return aggregate;
}

module.exports = aggregate;
