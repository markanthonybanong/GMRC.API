const httpStatusCode = require('http-status-codes');
const Entry = require('../models/entry');
const RoomPayment = require('../models/roomPayment');
const entryAggregate = require('../aggregation/entry');
const roomPaymentAggregate = require('../aggregation/roomPayment');
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
exports.createRoomPayment = async (req, res) => {
  const {
    amountKWUsed,
    date,
    electricBillBalance,
    electricBillStatus,
    presentReading,
    presentReadingKWUsed,
    previousReading,
    previousReadingKWUsed,
    riceCookerBillBalance,
    riceCookerBillStatus,
    roomNumber,
    waterBillBalance,
    waterBillStatus,
    roomTenants,
  } = req.body;

  const roomPayment = new RoomPayment({
    amountKWUsed: amountKWUsed,
    date: date,
    electricBillBalance: electricBillBalance,
    electricBillStatus: electricBillStatus,
    presentReading: presentReading,
    presentReadingKWUsed: presentReadingKWUsed,
    previousReading: previousReading,
    previousReadingKWUsed: previousReadingKWUsed,
    riceCookerBillBalance: riceCookerBillBalance,
    riceCookerBillStatus: riceCookerBillStatus,
    roomNumber: roomNumber,
    waterBillBalance: waterBillBalance,
    waterBillStatus: waterBillStatus,
    roomTenants: roomTenants,
  });

  roomPayment.save( (err, entry)=> {
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
exports.getRoomPayments = async (req, res) => {
  const options = {
    page: req.body.page,
    limit: req.body.limit,
  };

  RoomPayment.aggregatePaginate(roomPaymentAggregate(req.body.filters), options)
      .then( (roomPayments) => {
        res.status(httpStatusCode.OK)
            .send({
              data: roomPayments.data,
              pageCount: roomPayments.pageCount,
              totalCount: roomPayments.totalCount,
            });
      })
      .catch((err) => {
        res.status(httpStatusCode.BAD_REQUEST)
            .send({
              message: err,
            });
      });
};
exports.updateRoomPayment = async (req, res) => {
  const {
    amountKWUsed,
    date,
    electricBillBalance,
    electricBillStatus,
    presentReading,
    presentReadingKWUsed,
    previousReading,
    previousReadingKWUsed,
    riceCookerBillBalance,
    riceCookerBillStatus,
    roomNumber,
    waterBillBalance,
    waterBillStatus,
    roomTenants,
    gender,
  } = req.body;
  const {id: roomPaymentId} = req.params;
  RoomPayment.findByIdAndUpdate(roomPaymentId,
      {
        amountKWUsed: amountKWUsed,
        date: date,
        electricBillBalance: electricBillBalance,
        electricBillStatus: electricBillStatus,
        presentReading: presentReading,
        presentReadingKWUsed: presentReadingKWUsed,
        previousReading: previousReading,
        previousReadingKWUsed: previousReadingKWUsed,
        riceCookerBillBalance: riceCookerBillBalance,
        riceCookerBillStatus: riceCookerBillStatus,
        roomNumber: roomNumber,
        waterBillBalance: waterBillBalance,
        waterBillStatus: waterBillStatus,
        roomTenants: roomTenants,
      },
      {new: true},
      (err, roomPayment) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(roomPayment);
        }
      }
  );
};


