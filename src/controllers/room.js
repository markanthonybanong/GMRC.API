/* eslint-disable comma-dangle */
/* eslint-disable new-cap */
/* eslint-disable max-len */
const httpStatusCode = require('http-status-codes');
const Room = require('../models/room');
const Bed = require('../models/bed');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const roomAggregate = require('../aggregation/room');


/**
 * @param {*} roomObjectId, clients room object id to update
 * @param {*} bedspaceObjectId, bed object id to insert
 */
function addBedspaceObjectIdInRoom(roomObjectId, bedspaceObjectId) {
  Room.findByIdAndUpdate( roomObjectId,
      {
        $addToSet: {bedspaces: bedspaceObjectId},
      },
      {new: true},
      (err, bedspace) => {
      },
  );
};
/**
 *
 * @param {*} roomObjectId will remove bedpaces object id in this room
 * @param {*} bedObjectId the bedspace object id to be removed
 */
function removeBedObjectIdInRoom(roomObjectId, bedObjectId) {
  Room.findOneAndUpdate(
      {_id: ObjectId(roomObjectId)},
      {$pull: {bedspaces: ObjectId(bedObjectId)}},
      {},
      (err, bed) => {
        if (err) {
        }
      }
  );
}
exports.create = async (req, res) => {
  const {
    number,
    floor,
    type,
    aircon,
    transientPrivateRoomProperties,
  } = req.body;

  const room = new Room({
    number: number,
    floor: floor,
    type: type,
    aircon: aircon,
    transientPrivateRoomProperties: transientPrivateRoomProperties
  });

  room.save( (err, room)=> {
    if (err) {
      res.status(httpStatusCode.BAD_REQUEST)
          .send({
            message: err,
          });
    } else {
      res.status(httpStatusCode.OK)
          .json(room);
    }
  });
};
exports.update = async (req, res) => {
  const {
    floor,
    type,
    aircon,
    _id,
    transientPrivateRoomProperties,
  } = req.body;

  Room.findByIdAndUpdate(_id,
      {
        $set: {
          'floor': floor,
          'type': type,
          'aircon': aircon,
          'transientPrivateRoomProperties.0.status': transientPrivateRoomProperties[0].status,
          'transientPrivateRoomProperties.0.dueRentDate': transientPrivateRoomProperties[0].dueRentDate,
          'transientPrivateRoomProperties.0.monthlyRent': transientPrivateRoomProperties[0].monthlyRent,
        },
        $addToSet: {
          'transientPrivateRoomProperties.0.tenants': {
            $each: transientPrivateRoomProperties[0].tenants,
          }
        }
      },
      {new: true},
      (err, room) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(room);
        }
      });
};
exports.createBedspace = async (req, res) => {
  const {
    roomNumber,
    number,
    decks,
    roomObjectId,
  } = req.body;

  const bedspace = new Bed({
    roomNumber: roomNumber,
    number: number,
    decks: decks,
  });

  bedspace.save( (err, bedspace) => {
    if (err) {
      res.status(httpStatusCode.BAD_REQUEST)
          .send({
            message: err,
          });
    } else {
      addBedspaceObjectIdInRoom(roomObjectId, bedspace._id);
      res.status(httpStatusCode.OK)
          .json(bedspace);
    }
  });
};
exports.updateBedspace = async (req, res) => {
  const {
    _id,
    number,
    decks,
    roomNumber,
    roomObjectId,
  } = req.body;

  Bed.findByIdAndUpdate(_id,
      {
        roomNumber: roomNumber,
        number: number,
        decks: decks,
      },
      {new: true},
      (err, bedspace) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          addBedspaceObjectIdInRoom(roomObjectId, _id);
          res.status(httpStatusCode.OK)
              .json(bedspace);
        }
      },
  );
};
exports.removeBedspace = async (req, res) => {
  const {
    bedObjectId,
    roomObjectId,
  } = req.body;

  Bed.findByIdAndRemove(
      bedObjectId,
      {},
      (err, bed) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          removeBedObjectIdInRoom(roomObjectId, bedObjectId);
          res.status(httpStatusCode.OK)
              .json(bed);
        }
      });
};
exports.removeDeckInBedspace = async (req, res) => {
  Bed.findByIdAndUpdate(
      req.body.bedObjectId,
      {$pull: {decks: {_id: ObjectId(req.body.deckObjectId)}}},
      {new: true},
      (err, bed) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(bed);
        }
      },
  );
};
exports.getRooms = async (req, res) => {
  const options = {
    page: req.body.page,
    limit: req.body.limit,
  };

  Room.aggregatePaginate(roomAggregate(req.body.filters), options)
      .then( (rooms) => {
        res.status(httpStatusCode.OK)
            .send({
              data: rooms.data,
              pageCount: rooms.pageCount,
              totalCount: rooms.totalCount,
            });
      })
      .catch((err) => {
        res.status(httpStatusCode.BAD_REQUEST)
            .send({
              message: err,
            });
      });
};
exports.removeTenantInTransientPrivateRoom = async (req, res) => {
  const {
    tenantObjectId,
    roomObjectId,
  } = req.body;

  const conditions = {
    _id: ObjectId(roomObjectId),
  };

  Room.findByIdAndUpdate( conditions,
      {$pull: {'transientPrivateRoomProperties.0.tenants': ObjectId(tenantObjectId)}},
      {
        new: true,
      },
      ( err, room) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(room);
        }
      });
};
