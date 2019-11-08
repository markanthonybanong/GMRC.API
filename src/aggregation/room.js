/* eslint-disable max-len */
const Room = require('../models/room');
const {FilterType} = require('../core/enums/filterType');
const {RoomTypes} = require('../core/enums/roomTypes');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
/**
 * Aggregate the rooms collection.
 * @param {object} filter the object that contains the filter information.
 * @return {object} moongose agregated object.
 */
function aggregate(filter) {
  const aggregate = Room.aggregate();
  switch (filter.type) {
    case FilterType.ALLROOMS:
      aggregate.match({
        $or: [
          {type: RoomTypes.TRANSIENT},
          {type: RoomTypes.PRIVATE},
          {type: RoomTypes.BEDSPACE},
        ],
      }).sort({
        number: 1,
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.ROOMNUMBER:
      aggregate.match({
        number: filter.roomFilter.number,
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.TRANSIENTPRIVATEROOMS:
      aggregate.match({
        $or: [
          {type: RoomTypes.TRANSIENT},
          {type: RoomTypes.PRIVATE},
        ],
      }).lookup({
        from: 'tenants',
        localField: 'tenants',
        foreignField: '_id',
        as: 'tenantsArr',
      }).sort({
        number: 1,
      }).project({
        tenants: 0,
        bedspaces: 0,
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.TRANSIENTPRIVATEROOMBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.roomObjectId),
      }).lookup({
        from: 'tenants',
        localField: 'tenants',
        foreignField: '_id',
        as: 'tenantsArr',
      }).project({
        tenants: 0,
        bedspaces: 0,
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.ADVANCESEARCHTRANSIENTPRIVATEROOMS:
      aggregate.match({
        $or: [
          {type: RoomTypes.TRANSIENT},
          {type: RoomTypes.PRIVATE},
        ],
      }).match({
        $and: [filter.roomFilter],
      }).lookup({
        from: 'tenants',
        localField: 'tenants',
        foreignField: '_id',
        as: 'tenantsList',
      }).project({
        tenants: 0,
      });
      break;
    case FilterType.BEDSPACEROOMS:
      aggregate.match({
        type: RoomTypes.BEDSPACE,
      }).lookup({
        from: 'beds',
        let: {bedspaces: '$bedspaces'},
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$bedspaces'],
              },
            },
          },
          {
            $lookup: {
              from: 'tenants',
              localField: 'decks.tenant',
              foreignField: '_id',
              as: 'tenants',
            },
          },
          {
            $lookup: {
              from: 'tenants',
              localField: 'decks.away.tenant',
              foreignField: '_id',
              as: 'awayTenants',
            },
          },
          {
            $addFields: {
              decks: {
                $map: {
                  input: '$decks',
                  as: 'deck',
                  in: {
                    $mergeObjects: [
                      '$$deck',
                      {
                        tenant: {
                          $cond: {
                            if: {
                              $ne: ['$$deck.tenant', null],
                            },
                            then: {
                              $arrayElemAt: [
                                '$tenants',
                                {'$indexOfArray': ['$tenants._id', '$$deck.tenant']},
                              ],
                            },
                            else: null,
                          },
                        },
                      },
                      {
                        away: {
                          $cond: {
                            if: {
                              $ne: ['$$deck.away', null],
                            },
                            then: [{
                              willReturnIn: {$arrayElemAt: ['$$deck.away.willReturnIn', 0]},
                              inDate: {$arrayElemAt: ['$$deck.away.inDate', 0]},
                              inTime: {$arrayElemAt: ['$$deck.away.inTime', 0]},
                              outDate: {$arrayElemAt: ['$$deck.away.outDate', 0]},
                              outTime: {$arrayElemAt: ['$$deck.away.outTime', 0]},
                              status: {$arrayElemAt: ['$$deck.away.status', 0]},
                              dueRentDate: {$arrayElemAt: ['$$deck.away.dueRentDate', 0]},
                              rent: {$arrayElemAt: ['$$deck.away.rent', 0]},
                              tenant: {
                                $cond: {
                                  if: {
                                    $ne: [{$arrayElemAt: ['$$deck.away.tenant', 0]}, null],
                                  },
                                  then: {
                                    $arrayElemAt: [
                                      '$awayTenants',
                                      {$indexOfArray: ['$awayTenants._id', {$arrayElemAt: ['$$deck.away.tenant', 0]}]},
                                    ],
                                  },
                                  else: null,
                                },
                              },
                            }],
                            else: null,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            $project: {
              awayTenants: false,
              tenants: false,
            },
          },
        ],
        as: 'bedspaces',
      }).project({
        tenants: 0,
        dueRent: 0,
        created_at: 0,
        updatedAt: 0,
      });
      break;
    case FilterType.BEDSPACEROOMBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.roomObjectId),
      }).lookup({
        from: 'beds',
        let: {bedspaces: '$bedspaces'},
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$bedspaces'],
              },
            },
          },
          {
            $lookup: {
              from: 'tenants',
              localField: 'decks.tenant',
              foreignField: '_id',
              as: 'tenants',
            },
          },
          {
            $lookup: {
              from: 'tenants',
              localField: 'decks.away.tenant',
              foreignField: '_id',
              as: 'awayTenants',
            },
          },
          {
            $addFields: {
              decks: {
                $map: {
                  input: '$decks',
                  as: 'deck',
                  in: {
                    $mergeObjects: [
                      '$$deck',
                      {
                        tenant: {
                          $cond: {
                            if: {
                              $ne: ['$$deck.tenant', null],
                            },
                            then: {
                              $arrayElemAt: [
                                '$tenants',
                                {'$indexOfArray': ['$tenants._id', '$$deck.tenant']},
                              ],
                            },
                            else: null,
                          },
                        },
                      },
                      {
                        away: {
                          $cond: {
                            if: {
                              $ne: ['$$deck.away', null],
                            },
                            then: [{
                              willReturnIn: {$arrayElemAt: ['$$deck.away.willReturnIn', 0]},
                              inDate: {$arrayElemAt: ['$$deck.away.inDate', 0]},
                              inTime: {$arrayElemAt: ['$$deck.away.inTime', 0]},
                              outDate: {$arrayElemAt: ['$$deck.away.outDate', 0]},
                              outTime: {$arrayElemAt: ['$$deck.away.outTime', 0]},
                              status: {$arrayElemAt: ['$$deck.away.status', 0]},
                              dueRentDate: {$arrayElemAt: ['$$deck.away.dueRentDate', 0]},
                              rent: {$arrayElemAt: ['$$deck.away.rent', 0]},
                              tenant: {
                                $cond: {
                                  if: {
                                    $ne: [{$arrayElemAt: ['$$deck.away.tenant', 0]}, null],
                                  },
                                  then: {
                                    $arrayElemAt: [
                                      '$awayTenants',
                                      {$indexOfArray: ['$awayTenants._id', {$arrayElemAt: ['$$deck.away.tenant', 0]}]},
                                    ],
                                  },
                                  else: null,
                                },
                              },
                            }],
                            else: null,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            $project: {
              awayTenants: false,
              tenants: false,
            },
          },
        ],
        as: 'bedspaces',
      }).project({
        tenants: 0,
        dueRent: 0,
        created_at: 0,
        updatedAt: 0,
        transientPrivateRoomProperties: 0,
        __v: 0,
      });
      break;
    case FilterType.ADVANCESEARCHBEDSPACEROOMS:
      aggregate.match({type: RoomTypes.BEDSPACE})
          .lookup({
            from: 'beds',
            let: {bedspaces: '$bedspaces'},
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$_id', '$$bedspaces'],
                  },
                },
              },
              {
                $lookup: {
                  from: 'tenants',
                  localField: 'decks.tenant',
                  foreignField: '_id',
                  as: 'tenants',
                },
              },
              {
                $lookup: {
                  from: 'tenants',
                  localField: 'decks.away.tenant',
                  foreignField: '_id',
                  as: 'awayTenants',
                },
              },
              {
                $addFields: {
                  decks: {
                    $map: {
                      input: '$decks',
                      as: 'deck',
                      in: {
                        $mergeObjects: [
                          '$$deck',
                          {
                            tenant: {
                              $cond: {
                                if: {
                                  $ne: ['$$deck.tenant', null],
                                },
                                then: {
                                  $arrayElemAt: [
                                    '$tenants',
                                    {'$indexOfArray': ['$tenants._id', '$$deck.tenant']},
                                  ],
                                },
                                else: null,
                              },
                            },
                          },
                          {
                            away: {
                              $cond: {
                                if: {
                                  $ne: ['$$deck.away', null],
                                },
                                then: [{
                                  willReturnIn: {$arrayElemAt: ['$$deck.away.willReturnIn', 0]},
                                  inDate: {$arrayElemAt: ['$$deck.away.inDate', 0]},
                                  inTime: {$arrayElemAt: ['$$deck.away.inTime', 0]},
                                  outDate: {$arrayElemAt: ['$$deck.away.outDate', 0]},
                                  outTime: {$arrayElemAt: ['$$deck.away.outTime', 0]},
                                  status: {$arrayElemAt: ['$$deck.away.status', 0]},
                                  dueRentDate: {$arrayElemAt: ['$$deck.away.dueRentDate', 0]},
                                  rent: {$arrayElemAt: ['$$deck.away.rent', 0]},
                                  tenant: {
                                    $cond: {
                                      if: {
                                        $ne: [{$arrayElemAt: ['$$deck.away.tenant', 0]}, null],
                                      },
                                      then: {
                                        $arrayElemAt: [
                                          '$awayTenants',
                                          {$indexOfArray: ['$awayTenants._id', {$arrayElemAt: ['$$deck.away.tenant', 0]}]},
                                        ],
                                      },
                                      else: null,
                                    },
                                  },
                                }],
                                else: null,
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
              {
                $project: {
                  awayTenants: false,
                  tenants: false,
                },
              },
            ],
            as: 'bedspaces',
          }).addFields({
            isGivenRoomFilterMatch: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        {$eq: ['$number', filter.roomFilter.number]},
                        {$eq: ['$floor', filter.roomFilter.floor]},
                        {$eq: ['$aircon', filter.roomFilter.aircon]},
                      ],
                    },
                    then: true,
                  },
                  {
                    case: {
                      $and: [
                        {$eq: ['$number', filter.roomFilter.number]},
                        {$eq: ['$floor', filter.roomFilter.floor]},
                        {$eq: [filter.roomFilter.aircon, null]},
                      ],
                    },
                    then: true,
                  },
                  {
                    case: {
                      $and: [
                        {$eq: ['$number', filter.roomFilter.number]},
                        {$eq: ['$aircon', filter.roomFilter.aircon]},
                        {$eq: [filter.roomFilter.floor, null]},
                      ],
                    },
                    then: true,
                  },
                  {
                    case: {
                      $and: [
                        {$eq: ['$floor', filter.roomFilter.floor]},
                        {$eq: ['$aircon', filter.roomFilter.aircon]},
                        {$eq: [filter.roomFilter.number, null]},
                      ],
                    },
                    then: true,
                  },
                  {
                    case: {
                      $and: [
                        {$eq: ['$number', filter.roomFilter.number]},
                        {$eq: [null, filter.roomFilter.floor]},
                        {$eq: [null, filter.roomFilter.aircon]},
                      ],
                    },
                    then: true,
                  },
                  {
                    case: {
                      $and: [
                        {$eq: [null, filter.roomFilter.number]},
                        {$eq: ['$floor', filter.roomFilter.floor]},
                        {$eq: [null, filter.roomFilter.aircon]},
                      ],
                    },
                    then: true,
                  },
                  {
                    case: {
                      $and: [
                        {$eq: [null, filter.roomFilter.number]},
                        {$eq: [null, filter.roomFilter.floor]},
                        {$eq: ['$aircon', filter.roomFilter.aircon]},
                      ],
                    },
                    then: true,
                  },
                ],
                default: false,
              },
            },
            checkIfGivenBedspaceFilterMatch: {
              $cond: {
                if: {
                  $gt: [{$size: '$bedspaces'}, 0],
                },
                then: {
                  $map: {
                    input: '$bedspaces',
                    as: 'bedspace',
                    in: {
                      $cond: {
                        if: {
                          $ne: ['$$bedspace.decks', null],
                        },
                        then: {
                          $map: {
                            input: '$$bedspace.decks',
                            as: 'deck',
                            in: {
                              $switch: {
                                branches: [
                                  {
                                    case: {
                                      $and: [
                                        {$ne: [filter.bedspaceFilter.deckStatus, null]},
                                        {$ne: [filter.bedspaceFilter.awayDeckStatus, null]},
                                      ],
                                    },
                                    then: {
                                      $cond: {
                                        if: {
                                          $and: [
                                            {$eq: ['$$deck.status', filter.bedspaceFilter.deckStatus]},
                                            {$eq: [{$arrayElemAt: ['$$deck.away.status', 0]}, filter.bedspaceFilter.awayDeckStatus]},
                                          ],
                                        },
                                        then: true,
                                        else: false,
                                      },
                                    },
                                  },
                                  {
                                    case: {
                                      $or: [
                                        {$ne: [filter.bedspaceFilter.deckStatus, null]},
                                        {$ne: [filter.bedspaceFilter.awayDeckStatus, null]},
                                      ],
                                    },
                                    then: {
                                      $switch: {
                                        branches: [
                                          {
                                            case: {
                                              $ne: [filter.bedspaceFilter.deckStatus, null],
                                            },
                                            then: {
                                              $cond: {
                                                if: {
                                                  $eq: ['$$deck.status', filter.bedspaceFilter.deckStatus],
                                                },
                                                then: true,
                                                else: false,
                                              },
                                            },
                                          },
                                          {
                                            case: {
                                              $ne: [filter.bedspaceFilter.awayDeckStatus, null],
                                            },
                                            then: {
                                              $cond: {
                                                if: {
                                                  $eq: [{$arrayElemAt: ['$$deck.away.status', 0]}, filter.bedspaceFilter.awayDeckStatus],
                                                },
                                                then: true,
                                                else: false,
                                              },
                                            },
                                          },
                                        ],
                                        default: false,
                                      },
                                    },
                                  },
                                ],
                                default: false,
                              },
                            },
                          },
                        },
                        else: [false],
                      },
                    },
                  },
                },
                else: [[false]],
              },
            },
          }).addFields({
            isGivenBedspaceFilterMatch: {
              $map: {
                input: '$checkIfGivenBedspaceFilterMatch',
                as: 'bedspaceFilterResultArr',
                in: {
                  $in: [true, '$$bedspaceFilterResultArr'],
                },
              },
            },
          }).addFields({
            displayRoom: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        {
                          $or: [
                            {$ne: [filter.roomFilter.number, null]},
                            {$ne: [filter.roomFilter.floor, null]},
                            {$ne: [filter.roomFilter.aircon, null]},
                          ],
                        },
                        {
                          $or: [
                            {$ne: [filter.bedspaceFilter.deckStatus, null]},
                            {$ne: [filter.bedspaceFilter.awayDeckStatus, null]},
                          ],
                        },
                      ],
                    },
                    then: {
                      $cond: {
                        if: {
                          $and: [
                            {$eq: ['$isGivenRoomFilterMatch', true]},
                            {$eq: [{$in: [true, '$isGivenBedspaceFilterMatch']}, true]},
                          ],
                        },
                        then: true,
                        else: false,
                      },
                    },
                  },
                  {
                    case: {
                      $and: [
                        {
                          $or: [
                            {$ne: [filter.roomFilter.number, null]},
                            {$ne: [filter.roomFilter.floor, null]},
                            {$ne: [filter.roomFilter.aircon, null]},
                          ],
                        },
                        {
                          $and: [
                            {$eq: [filter.bedspaceFilter.deckStatus, null]},
                            {$eq: [filter.bedspaceFilter.awayDeckStatus, null]},
                          ],
                        },
                      ],
                    },
                    then: {
                      $cond: {
                        if: {
                          $eq: ['$isGivenRoomFilterMatch', true],
                        },
                        then: true,
                        else: false,
                      },
                    },
                  },
                  {
                    case: {
                      $and: [
                        {
                          $and: [
                            {$eq: [filter.roomFilter.number, null]},
                            {$eq: [filter.roomFilter.floor, null]},
                            {$eq: [filter.roomFilter.aircon, null]},
                          ],
                        },
                        {
                          $or: [
                            {$ne: [filter.bedspaceFilter.deckStatus, null]},
                            {$ne: [filter.bedspaceFilter.awayDeckStatus, null]},
                          ],
                        },
                      ],
                    },
                    then: {
                      $cond: {
                        if: {
                          $eq: [{$in: [true, '$isGivenBedspaceFilterMatch']}, true],
                        },
                        then: true,
                        else: false,
                      },
                    },
                  },
                ],
                default: false,
              },
            },
          }).match({
            displayRoom: true,
          }).project({
            isGivenRoomFilterMatch: false,
            checkIfGivenBedspaceFilterMatch: false,
            isGivenBedspaceFilterMatch: false,
            displayRoom: false,
            created_at: false,
            updatedAt: false,
            tenants: false,
            dueRent: false,
            __v: false,
          });
      break;
  }
  return aggregate;
}

module.exports = aggregate;
