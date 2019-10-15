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
    case FilterType.INQUIRYBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.inquiryObjectId),
      });
      break;
    case FilterType.ADVANCESEARCHINQUIRY:
      aggregate.match({
        $and: [
          inquiryController.setValueForWillOccupyInKey(filter.inquiryFilter),
        ],
      });
      break;
  }
  return aggregate;
}

module.exports = aggregate;
