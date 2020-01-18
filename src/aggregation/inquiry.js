/* eslint-disable max-len */
const Inquiry = require('../models/inquiry');
const {FilterType} = require('../core/enums/filterType');
const inquiryController = require('../controllers/inquiry');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
/**
 * Aggregate the rooms collection.
 * @param {object} filter the object that contains the filter information.
 * @return {object} moongose agregated object.
 */
function aggregate(filter) {
  const aggregate = Inquiry.aggregate();
  switch (filter.type) {
    case FilterType.ALLINQUIRIES:
      aggregate.sort({
        willOccupyIn: 1,
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      aggregate.project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.INQUIRYBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.inquiryObjectId),
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.ADVANCESEARCHINQUIRY:
      aggregate.match({
        $and: [
          inquiryController.setValueForWillOccupyInKey(filter.inquiryFilter),
        ],
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
