const httpStatusCode = require('http-status-codes');
const Entry = require('../models/entry');
const entryAggregate = require('../aggregation/entry');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;

exports.createEntry = async (req, res) => {
  console.log('req ', req.body);
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

