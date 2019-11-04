const httpStatusCode = require('http-status-codes');
const Inquiry = require('../models/inquiry');
const inquiryAggregate = require('../aggregation/inquiry');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
/*
  willOccupyIn - object key that have date value.
               - wrap value to new Date so mongo match aggregation can read.
*/
exports.setValueForWillOccupyInKey = function(searchFilter) {
  const modifiedFilter = {};
  Object.entries(searchFilter).forEach( (element) => {
    if (element[0] === 'willOccupyIn') {
      modifiedFilter[element[0]] = new Date(element[1]);
    } else {
      modifiedFilter[element[0]] = element[1];
    }
  });
  return modifiedFilter;
};
exports.create = async (req, res) => {
  const {
    name,
    roomNumber,
    howDidYouFindUs,
    phoneNumber,
    willOccupyIn,
    gender,
    roomType,
    status,
    bedInfos,
  } = req.body;

  const inquiry = new Inquiry({
    name: name,
    roomNumber: roomNumber,
    howDidYouFindUs: howDidYouFindUs,
    willOccupyIn: willOccupyIn,
    phoneNumber: phoneNumber,
    gender: gender,
    roomType: roomType,
    status: status,
    bedInfos: bedInfos,
  });
  inquiry.save( (err, inquiry) => {
    if (err) {
      res.status(httpStatusCode.BAD_REQUEST)
          .send({
            message: err,
          });
    } else {
      res.status(httpStatusCode.OK)
          .json(inquiry);
    }
  });
};
exports.update = async (req, res) => {
  const {
    name,
    roomNumber,
    howDidYouFindUs,
    willOccupyIn,
    phoneNumber,
    gender,
    roomType,
    deckNumbers,
  } = req.body;
  const {id: inquiryId} = req.params;
  Inquiry.findByIdAndUpdate(inquiryId,
      {
        name: name,
        roomNumber: roomNumber,
        howDidYouFindUs: howDidYouFindUs,
        willOccupyIn: willOccupyIn,
        phoneNumber: phoneNumber,
        gender: gender,
        roomType: roomType,
        deckNumbers: deckNumbers,
      },
      {new: true},
      (err, inquiry) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(inquiry);
        }
      }
  );
};
exports.getInquiries = async (req, res) => {
  const options = {
    page: req.body.page,
    limit: req.body.limit,
  };

  Inquiry.aggregatePaginate(inquiryAggregate(req.body.filters), options)
      .then( (inquiries) => {
        res.status(httpStatusCode.OK)
            .send({
              data: inquiries.data,
              pageCount: inquiries.pageCount,
              totalCount: inquiries.totalCount,
            });
      })
      .catch((err) => {
        res.status(httpStatusCode.BAD_REQUEST)
            .send({
              message: err,
            });
      });
};
exports.remove = async (req, res) => {
  const inquiryId = objectId(req.params.id);
  Inquiry.findByIdAndRemove(
      inquiryId,
      {},
      (err, inquiry) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(inquiry);
        }
      });
};
