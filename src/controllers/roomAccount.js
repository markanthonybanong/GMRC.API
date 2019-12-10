const httpStatusCode = require('http-status-codes');
const RoomAccount = require('../models/roomAccount');
const roomAccountAggregate = require('../aggregation/roomAccount');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
  const {
    roomNumber,
    password,
  } = req.body;

  const roomAccount = new RoomAccount({
    roomNumber: roomNumber,
    password: password,
  });

  roomAccount.save( (err, roomAccount) => {
    if (err) {
      res.status(httpStatusCode.BAD_REQUEST)
          .send({
            message: err,
          });
    } else {
      res.status(httpStatusCode.OK)
          .json(roomAccount);
    }
  });
};

exports.update = async (req, res) => {
  const {
    roomNumber,
    password,
    _id,
  } = req.body;

  RoomAccount.findByIdAndUpdate(_id,
      {
        roomNumber: roomNumber,
        password: password,
      },
      {new: true},
      (err, roomAccount) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(roomAccount);
        }
      }
  );
};

exports.getRoomAccounts = async (req, res) => {
  const options = {
    page: req.body.page,
    limit: req.body.limit,
  };

  RoomAccount.aggregatePaginate(roomAccountAggregate(req.body.filters), options)
      .then( (roomAccounts) => {
        res.status(httpStatusCode.OK)
            .send({
              data: roomAccounts.data,
              pageCount: roomAccounts.pageCount,
              totalCount: roomAccounts.totalCount,
            });
      })
      .catch((err) => {
        res.status(httpStatusCode.BAD_REQUEST)
            .send({
              message: err,
            });
      });
};
