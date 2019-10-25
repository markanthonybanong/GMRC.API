/* eslint-disable max-len */
const Entry = require('../models/entry');
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
  console.log('FILTER', filter);
  const aggregate = Entry.aggregate();
  switch (filter.type) {
    case FilterType.ALLENTRIES:
      aggregate.lookup({
        from: 'tenants',
        localField: 'tenant',
        foreignField: '_id',
        as: 'tenant',
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.ENTRYBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.entryObjectId),
      });
      break;
    case FilterType.ADVANCESEARCHENTRY:
      aggregate.match({
        $and: [
          paymentController.setValueForDatesKey(filter.entryFilter),
        ],
      });
      break;
  }
  return aggregate;
}

module.exports = aggregate;
