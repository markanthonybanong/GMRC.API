const httpStatusCode = require('http-status-codes');
const Entry = require('../models/entry');

exports.createEntry = async (req, res) => {
  console.log('req ', req.body);
  const {
    tenantObjectId,
    roomType,
    monthlyRent,
    key,
    oneMonthDeposit,
    oneMonthDepositBalance,
    oneMonthAdvance,
    oneMonthAdvanceBalance,
  } = req.body;

  const entry = new Entry({
    tenant: tenantObjectId,
    roomType: roomType,
    monthlyRent: monthlyRent,
    key: key,
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

