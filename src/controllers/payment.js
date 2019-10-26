const httpStatusCode = require('http-status-codes');
const Entry = require('../models/entry');
const entryAggregate = require('../aggregation/entry');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;

exports.setValueForSearchFilter = function(searchFilter) {
  const modifiedFilter = {};
  Object.entries(searchFilter).forEach( (element) => {
    switch (element[0]) {
      case 'dateEntry':
        modifiedFilter[element[0]] = new Date(element[1]);
        break;
      case 'dateExit':
        modifiedFilter[element[0]] = new Date(element[1]);
        break;
      case 'tenant':
        modifiedFilter[element[0]] = objectId(element[1]);
        break;
      default:
        modifiedFilter[element[0]] = element[1];
        break;
    }
  });
  return modifiedFilter;
};
exports.createEntry = async (req, res) => {
  const {
    roomNumber,
    tenantObjectId,
    monthlyRent,
    dateEntry,
    dateExit,
    key,
    oneMonthDeposit,
    oneMonthDepositBalance,
    oneMonthAdvance,
    oneMonthAdvanceBalance,
  } = req.body;

  const entry = new Entry({
    roomNumber: roomNumber,
    tenant: tenantObjectId,
    monthlyRent: monthlyRent,
    key: key,
    dateEntry: dateEntry,
    dateExit: dateExit,
    oneMonthDeposit: oneMonthDeposit,
    oneMonthDepositBalance: oneMonthDepositBalance,
    oneMonthAdvance: oneMonthAdvance,
    oneMonthAdvanceBalance: oneMonthAdvanceBalance,
  });

  entry.save( (err, entry)=> {
    if (err) {
      res.status(httpStatusCode.BAD_REQUEST)
          .send({
            message: err,
          });
    } else {
      res.status(httpStatusCode.OK)
          .json(entry);
    }
  });
};
exports.getEntries = async (req, res) => {
  const options = {
    page: req.body.page,
    limit: req.body.limit,
  };
  Entry.aggregatePaginate(entryAggregate(req.body.filters), options)
      .then( (entry) => {
        res.status(httpStatusCode.OK)
            .send({
              data: entry.data,
              pageCount: entry.pageCount,
              totalCount: entry.totalCount,
            });
      })
      .catch((err) => {
        res.status(httpStatusCode.BAD_REQUEST)
            .send({
              message: err,
            });
      });
};
exports.updateEntry = async (req, res) => {
  const {
    dateEntry,
    dateExit,
    key,
    monthlyRent,
    oneMonthAdvance,
    oneMonthAdvanceBalance,
    oneMonthDeposit,
    oneMonthDepositBalance,
    roomNumber,
    tenantObjectId,
  } = req.body;
  const {id: entryId} = req.params;
  Entry.findByIdAndUpdate(entryId,
      {
        dateEntry: dateEntry,
        dateExit: dateExit,
        key: key,
        monthlyRent: monthlyRent,
        oneMonthAdvance: oneMonthAdvance,
        oneMonthAdvanceBalance: oneMonthAdvanceBalance,
        oneMonthDeposit: oneMonthDeposit,
        oneMonthDepositBalance: oneMonthDepositBalance,
        roomNumber: roomNumber,
        tenant: tenantObjectId,
      },
      {new: true},
      (err, entry) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(entry);
        }
      }
  );
};

