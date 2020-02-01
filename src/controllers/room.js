/* eslint-disable comma-dangle */
/* eslint-disable new-cap */
/* eslint-disable max-len */
const httpStatusCode = require('http-status-codes');
const Room = require('../models/room');
const Bed = require('../models/bed');
const UnsettleBill = require('../models/unsettleBill');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const roomAggregate = require('../aggregation/room');
const unsettleBillAggregate = require('../aggregation/unsettleBill');


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
  Room.findByIdAndUpdate(req.body._id,
      req.body,
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
exports.createBed = async (req, res) => {
  const {
    roomObjectId,
    bed
  } = req.body;
  console.log('bed body ', bed);
  
  const bedspace = new Bed(bed);

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
},
exports.updateBed = async (req, res) => {
  const {
    bedObjectId,
    bed,
  } = req.body;
  console.log('req.body ', req.body);
  
  Bed.findOneAndUpdate(bedObjectId,
      bed,
      {new: true},
      (err, bedspace) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(bedspace);
        }
      },
  );
};
exports.createDeckInBed = async (req, res) => { 
  const {
    _id,
    decks
  } = req.body;

  const conditions = {
    '_id': ObjectId(_id),
  };
  Bed.findOneAndUpdate( conditions,
      {
        $push: {
          decks: {
            dueRentDate: decks[0].dueRentDate,
            monthlyRent: decks[0].monthlyRent,
            riceCookerBill: decks[0].riceCookerBill,
            number: decks[0].number,
            status: decks[0].status,
            tenant: decks[0].tenantObjectId,
            away: null,
          }
        }
      },
      {
        new: true,
      },
      ( err, bed) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(bed);
        }
      });
};
exports.updateDeckInBed = async (req, res) => {
  const {
    _id,
    decks,
  } = req.body;
  const deck = decks[0];
  const condition = {
    '_id': ObjectId(_id),
    'decks._id': ObjectId(deck._id),
  };

  Bed.findOneAndUpdate(condition,
      {
        $set: {
          'decks.$.dueRentDate': deck.dueRentDate,
          'decks.$.monthlyRent': deck.monthlyRent,
          'decks.$.riceCookerBill': deck.riceCookerBill,
          'decks.$.number': deck.number,
          'decks.$.status': deck.status,
          'decks.$.tenant': deck.tenantObjectId,
          'decks.$.away': deck.away,
        }
      },
      {new: true},
      (err, bedspace) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(bedspace);
        }
      },
  );
};
exports.addUpdateAwayInDeck = async (req, res) => {
  const {
    _id,
    deckObjectId,
    away
  } = req.body;
  const condition = {
    '_id': ObjectId(_id),
    'decks._id': ObjectId(deckObjectId),
  };
  Bed.findOneAndUpdate(condition,
      {
        $set: {
          'decks.$.away': [{
            willReturnIn: away[0].willReturnIn,
            status: away[0].status,
            inDate: away[0].inDate,
            inTime: away[0].inTime,
            outDate: away[0].outDate,
            outTime: away[0].outTime,
            dueRentDate: away[0].dueRentDate,
            rent: away[0].rent,
            tenant: away[0].tenantObjectId,
          }]
        },
      },
      {new: true},
      (err, bedspace) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
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
exports.addTenantInTransientPrivateRoom = async (req, res) => {
  const {
    roomObjectId,
    tenantObjectId,
  } = req.body;

  const conditions = {
    _id: ObjectId(roomObjectId),
  };

  Room.findByIdAndUpdate( conditions,
      {
        $addToSet: {
          'roomProperties.0.tenants': tenantObjectId
        }
      },
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
exports.removeTenantInTransientPrivateRoom = async (req, res) => {
  const {
    tenantObjectId,
    roomObjectId,
  } = req.body;

  const conditions = {
    _id: ObjectId(roomObjectId),
  };

  Room.findByIdAndUpdate( conditions,
      {$pull: {'roomProperties.0.tenants': ObjectId(tenantObjectId)}},
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
exports.getTransientPrivateRoomByTenantsObjectId = async (req, res) => {
  const {
    tenantsObjectId
  } = req.body;

  Room.find(
      {
        'transientPrivateRoomProperties.0.tenants': {$in: tenantsObjectId}
      },
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
      }
  );
};
exports.createUnsettleBill = async (req, res) => {
  const {
    roomNumber,
    roomType,
    tenantsObjectId,
    dueDate,
    dateExit,
    rentBalance,
    electricBillBalance,
    waterBillBalance,
    riceCookerBillBalance,
  } = req.body;

  const unsettleBill = new UnsettleBill({
    roomNumber: roomNumber,
    roomType: roomType,
    tenants: tenantsObjectId,
    dueDate: dueDate,
    dateExit: dateExit,
    rentBalance: rentBalance,
    electricBillBalance: electricBillBalance,
    waterBillBalance: waterBillBalance,
    riceCookerBillBalance: riceCookerBillBalance,
  });

  unsettleBill.save( (err, unsettleBill)=> {
    if (err) {
      res.status(httpStatusCode.BAD_REQUEST)
          .send({
            message: err,
          });
    } else {
      res.status(httpStatusCode.OK)
          .json(unsettleBill);
    }
  });
};
exports.getUnsettleBills = async (req, res) => {
  const options = {
    page: req.body.page,
    limit: req.body.limit,
  };

  UnsettleBill.aggregatePaginate(unsettleBillAggregate(req.body.filters), options)
      .then( (unsettleBills) => {
        res.status(httpStatusCode.OK)
            .send({
              data: unsettleBills.data,
              pageCount: unsettleBills.pageCount,
              totalCount: unsettleBills.totalCount,
            });
      })
      .catch((err) => {
        res.status(httpStatusCode.BAD_REQUEST)
            .send({
              message: err,
            });
      });
};
exports.removeTenantInUnsettleBill = async (req, res) => {
  const {
    tenantObjectId,
    unsettleBillObjectId,
  } = req.body;

  const conditions = {
    _id: ObjectId(unsettleBillObjectId),
  };

  UnsettleBill.findByIdAndUpdate( conditions,
      {$pull: {'tenants': ObjectId(tenantObjectId)}},
      {
        new: true,
      },
      ( err, unsettleBill) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(unsettleBill);
        }
      });
};
exports.updateUnsettleBill = async (req, res) => {
  const {
    roomNumber,
    roomType,
    tenantsObjectId,
    dueDate,
    dateExit,
    rentBalance,
    electricBillBalance,
    waterBillBalance,
    riceCookerBillBalance,
    _id
  } = req.body;

  UnsettleBill.findByIdAndUpdate(ObjectId(_id),
      {
        roomNumber: roomNumber,
        roomType: roomType,
        tenants: tenantsObjectId,
        dueDate: dueDate,
        dateExit: dateExit,
        rentBalance: rentBalance,
        electricBillBalance: electricBillBalance,
        waterBillBalance: waterBillBalance,
        riceCookerBillBalance: riceCookerBillBalance,
      },
      {new: true},
      (err, unsettleBill) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(unsettleBill);
        }
      });
};
exports.removeUnsettleBill = async (req, res) => {
  const unsettleBillObjectId = ObjectId(req.params.id);
  UnsettleBill.findByIdAndRemove(
      unsettleBillObjectId,
      {},
      (err, unsettleBill) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(unsettleBill);
        }
      });
};
