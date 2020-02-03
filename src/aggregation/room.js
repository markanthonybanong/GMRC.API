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
          {type: RoomTypes.SEMIPRIVATE},
        ],
      }).lookup({
        from: 'tenants',
        localField: 'roomProperties.tenants',
        foreignField: '_id',
        as: 'tenants',
      }).unwind({
        path: '$roomProperties',
        preserveNullAndEmptyArrays: true,
      }).addFields({
        roomProperties: [{
          status: '$roomProperties.status',
          dueRentDate: '$roomProperties.dueRentDate',
          monthlyRent: '$roomProperties.monthlyRent',
          riceCookerBill: '$roomProperties.riceCookerBill',
          tenants: '$tenants',
        }], // private-transient
      }).lookup({
        from: 'beds',
        let: {bedspace: '$bedspaces'},
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$bedspace'],
              },
            },
          },
          {
            $lookup: {
              from: 'tenants',
              localField: 'decks.tenantObjectId',
              foreignField: '_id',
              as: 'tenants',
            },
          },
          {
            $lookup: {
              from: 'tenants',
              localField: 'decks.away.tenantObjectId',
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
                              $ne: ['$$deck.tenantObjectId', null],
                            },
                            then: {
                              $arrayElemAt: [
                                '$tenants',
                                {'$indexOfArray': ['$tenants._id', '$$deck.tenantObjectId']},
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
                              $size: '$$deck.away',
                            },
                            then: [{
                              $mergeObjects: [
                                {
                                  $arrayElemAt: ['$$deck.away', 0],
                                },
                                {
                                  tenant: {
                                    $cond: {
                                      if: {
                                        $ne: [{$arrayElemAt: ['$$deck.away.tenantObjectId', 0]}, null],
                                      },
                                      then: {
                                        $arrayElemAt: [
                                          '$awayTenants',
                                          {$indexOfArray: ['$awayTenants._id', {$arrayElemAt: ['$$deck.away.tenantObjectId', 0]}]},
                                        ],
                                      },
                                      else: null,
                                    },
                                  },
                                },
                              ],
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
        as: 'bedspaces', // bedspaces
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
        localField: 'roomProperties.tenants',
        foreignField: '_id',
        as: 'tenants',
      }).addFields({
        TPRoompropertyStatus: {
          $map: {
            input: '$roomProperties',
            in: '$$this.status',
          },
        },
        TPRoompropertyDueRentDate: {
          $map: {
            input: '$roomProperties',
            in: '$$this.dueRentDate',
          },
        },
        TPRoompropertyMonthlyRent: {
          $map: {
            input: '$roomProperties',
            in: '$$this.monthlyRent',
          },
        },
        TPRoompropertyRiceCookerBill: {
          $map: {
            input: '$roomProperties',
            in: '$$this.riceCookerBill',
          },
        },
      }).project({
        number: 1,
        floor: 1,
        type: 1,
        aircon: 1,
        roomProperties: [{
          status: {
            $arrayElemAt: ['$TPRoompropertyStatus', 0],
          },
          dueRentDate: {
            $arrayElemAt: ['$TPRoompropertyDueRentDate', 0],
          },
          monthlyRent: {
            $arrayElemAt: ['$TPRoompropertyMonthlyRent', 0],
          },
          riceCookerBill: {
            $arrayElemAt: ['$TPRoompropertyRiceCookerBill', 0],
          },
          tenants: '$tenants',
        }],
      }).sort({
        number: 1,
      });
      break;
    case FilterType.TRANSIENTPRIVATEROOMBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.roomObjectId),
      }).lookup({
        from: 'tenants',
        localField: 'roomProperties.tenants',
        foreignField: '_id',
        as: 'tenants',
      }).addFields({
        TPRoompropertyStatus: {
          $map: {
            input: '$roomProperties',
            in: '$$this.status',
          },
        },
        TPRoompropertyDueRentDate: {
          $map: {
            input: '$roomProperties',
            in: '$$this.dueRentDate',
          },
        },
        TPRoompropertyMonthlyRent: {
          $map: {
            input: '$roomProperties',
            in: '$$this.monthlyRent',
          },
        },
        TPRoompropertyRiceCookerBill: {
          $map: {
            input: '$roomProperties',
            in: '$$this.riceCookerBill',
          },
        },
      }).project({
        number: 1,
        floor: 1,
        type: 1,
        aircon: 1,
        roomProperties: [{
          status: {
            $arrayElemAt: ['$TPRoompropertyStatus', 0],
          },
          dueRentDate: {
            $arrayElemAt: ['$TPRoompropertyDueRentDate', 0],
          },
          monthlyRent: {
            $arrayElemAt: ['$TPRoompropertyMonthlyRent', 0],
          },
          riceCookerBill: {
            $arrayElemAt: ['$TPRoompropertyRiceCookerBill', 0],
          },
          tenants: '$tenants',
        }],
      });
      break;
    case FilterType.ADVANCESEARCHTRANSIENTPRIVATEROOMS:
      aggregate.match({
        $or: [
          {type: RoomTypes.TRANSIENT},
          {type: RoomTypes.PRIVATE},
        ],
      }).addFields({
        statusArr: {
          $map: {
            input: '$roomProperties',
            as: 'property',
            in:
              '$$property.status',
          },
        },
        dueRentArr: {
          $map: {
            input: '$roomProperties',
            as: 'property',
            in:
              '$$property.dueRentDate',
          },
        },
      }).project({
        number: 1,
        floor: 1,
        type: 1,
        aircon: 1,
        roomProperties: 1,
        status: {$arrayElemAt: ['$statusArr', 0]},
        dueRentDate: {$arrayElemAt: ['$dueRentArr', 0]},
      }).match({
        $and: [filter.roomFilter],
      }).unwind({
        path: '$roomProperties',
        preserveNullAndEmptyArrays: true,
      }).lookup({
        from: 'tenants',
        localField: 'roomProperties.tenants',
        foreignField: '_id',
        as: 'tenant',
      }).project({
        number: 1,
        floor: 1,
        type: 1,
        aircon: 1,
        roomProperties: [{
          tenants: '$tenant',
          status: '$roomProperties.status',
          dueRentDate: '$roomProperties.dueRentDate',
          monthlyRent: '$roomProperties.monthlyRent',
          riceCookerBill: '$roomProperties.riceCookerBill',
        }],
      });
      break;
    case FilterType.BEDSPACEROOMS:
      aggregate.match({
        type: RoomTypes.BEDSPACE,
      }).lookup({
        from: 'beds',
        let: {bedspace: '$bedspaces'},
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$bedspace'],
              },
            },
          },
          {
            $lookup: {
              from: 'tenants',
              localField: 'decks.tenantObjectId',
              foreignField: '_id',
              as: 'tenants',
            },
          },
          {
            $lookup: {
              from: 'tenants',
              localField: 'decks.away.tenantObjectId',
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
                              $ne: ['$$deck.tenantObjectId', null],
                            },
                            then: {
                              $arrayElemAt: [
                                '$tenants',
                                {'$indexOfArray': ['$tenants._id', '$$deck.tenantObjectId']},
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
                              $size: '$$deck.away',
                            },
                            then: [{
                              $mergeObjects: [
                                {
                                  $arrayElemAt: ['$$deck.away', 0],
                                },
                                {
                                  tenant: {
                                    $cond: {
                                      if: {
                                        $ne: [{$arrayElemAt: ['$$deck.away.tenantObjectId', 0]}, null],
                                      },
                                      then: {
                                        $arrayElemAt: [
                                          '$awayTenants',
                                          {$indexOfArray: ['$awayTenants._id', {$arrayElemAt: ['$$deck.away.tenantObjectId', 0]}]},
                                        ],
                                      },
                                      else: null,
                                    },
                                  },
                                },
                              ],
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
        roomProperties: 0,
        created_at: 0,
        updatedAt: 0,
      }).sort({
        number: 1,
      });
      break;
    case FilterType.BEDSPACEROOMBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.roomObjectId),
      }).lookup({
        from: 'beds',
        let: {bedspace: '$bedspaces'},
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$bedspace'],
              },
            },
          },
          {
            $lookup: {
              from: 'tenants',
              localField: 'decks.tenantObjectId',
              foreignField: '_id',
              as: 'tenants',
            },
          },
          {
            $lookup: {
              from: 'tenants',
              localField: 'decks.away.tenantObjectId',
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
                              $ne: ['$$deck.tenantObjectId', null],
                            },
                            then: {
                              $arrayElemAt: [
                                '$tenants',
                                {'$indexOfArray': ['$tenants._id', '$$deck.tenantObjectId']},
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
                              $size: '$$deck.away',
                            },
                            then: [{
                              $mergeObjects: [
                                {
                                  $arrayElemAt: ['$$deck.away', 0],
                                },
                                {
                                  tenant: {
                                    $cond: {
                                      if: {
                                        $ne: [{$arrayElemAt: ['$$deck.away.tenantObjectId', 0]}, null],
                                      },
                                      then: {
                                        $arrayElemAt: [
                                          '$awayTenants',
                                          {$indexOfArray: ['$awayTenants._id', {$arrayElemAt: ['$$deck.away.tenantObjectId', 0]}]},
                                        ],
                                      },
                                      else: null,
                                    },
                                  },
                                },
                              ],
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
        roomProperties: 0,
      });
      break;
    case FilterType.ADVANCESEARCHBEDSPACEROOMS:
      aggregate.match({type: RoomTypes.BEDSPACE})
          .lookup({
            from: 'beds',
            let: {bedspace: '$bedspaces'},
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$_id', '$$bedspace'],
                  },
                },
              },
              {
                $lookup: {
                  from: 'tenants',
                  localField: 'decks.tenantObjectId',
                  foreignField: '_id',
                  as: 'tenants',
                },
              },
              {
                $lookup: {
                  from: 'tenants',
                  localField: 'decks.away.tenantObjectId',
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
                                  $ne: ['$$deck.tenantObjectId', null],
                                },
                                then: {
                                  $arrayElemAt: [
                                    '$tenants',
                                    {'$indexOfArray': ['$tenants._id', '$$deck.tenantObjectId']},
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
                                  $size: '$$deck.away',
                                },
                                then: [{
                                  $mergeObjects: [
                                    {
                                      $arrayElemAt: ['$$deck.away', 0],
                                    },
                                    {
                                      tenant: {
                                        $cond: {
                                          if: {
                                            $ne: [{$arrayElemAt: ['$$deck.away.tenantObjectId', 0]}, null],
                                          },
                                          then: {
                                            $arrayElemAt: [
                                              '$awayTenants',
                                              {$indexOfArray: ['$awayTenants._id', {$arrayElemAt: ['$$deck.away.tenantObjectId', 0]}]},
                                            ],
                                          },
                                          else: null,
                                        },
                                      },
                                    },
                                  ],
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
              $map: {
                input: '$bedspaces',
                as: 'bedspace',
                in: {
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
                    // user give room and deck filter
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
                            {$in: [true, '$isGivenBedspaceFilterMatch']},
                          ],
                        },
                        then: true,
                        else: false,
                      },
                    },
                  },
                  {
                    // user give room filter only
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
                    // user give bedspace filter only
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
            roomProperties: false,
            __v: false,
          });
      break;
    case FilterType.ROOMSBYTENANTOBJECTID:
      aggregate.match({
        $or: [
          {type: RoomTypes.TRANSIENT},
          {type: RoomTypes.PRIVATE},
          {type: RoomTypes.BEDSPACE},
        ],
      }).lookup({
        from: 'beds',
        localField: 'bedspaces',
        foreignField: '_id',
        as: 'bedspaces',
      }).addFields({
        getTenantsObjectIdInBedspaceRooms: {
          $map: {
            input: '$bedspaces',
            as: 'bedspace',
            in: {
              $map: {
                input: '$$bedspace.decks',
                in: {
                  $cond: {
                    if: {
                      $ne: ['$$this.away', null],
                    },
                    then: [
                      '$$this.tenant',
                      {$arrayElemAt: ['$$this.away.tenant', 0]},
                    ],
                    else: ['$$this.tenant'],
                  },
                },
              },
            },
          },
        },
      }).unwind({
        path: '$getTenantsObjectIdInBedspaceRooms',
        preserveNullAndEmptyArrays: true,
      }).unwind({
        path: '$getTenantsObjectIdInBedspaceRooms',
        preserveNullAndEmptyArrays: true,
      }).unwind({
        path: '$getTenantsObjectIdInBedspaceRooms',
        preserveNullAndEmptyArrays: true,
      }).group({
        _id: '$_id',
        bedspaces: {$first: '$bedspaces'},
        number: {$first: '$number'},
        floor: {$first: '$floor'},
        type: {$first: '$type'},
        aircon: {$first: '$aircon'},
        transientPrivateRoomProperties: {$first: '$transientPrivateRoomProperties'},
        tenantsObjectIdInBedspaceRooms: {
          $push: '$getTenantsObjectIdInBedspaceRooms',
        },
      }).addFields({
        isTenantObjectIdFoundInBedspaceRooms: {
          $in: [objectId(filter.tenantObjectId), '$tenantsObjectIdInBedspaceRooms'],
        },
        tenantsObjectIdInTransientPrivateRoom: {
          $arrayElemAt: ['$transientPrivateRoomProperties.tenants', 0],
        },
      }).unwind({
        path: '$tenantsObjectIdInTransientPrivateRoom',
        preserveNullAndEmptyArrays: true,
      }).group({
        _id: '$_id',
        bedspaces: {$first: '$bedspaces'},
        number: {$first: '$number'},
        floor: {$first: '$floor'},
        type: {$first: '$type'},
        aircon: {$first: '$aircon'},
        isTenantObjectIdFoundInBedspaceRooms: {$first: '$isTenantObjectIdFoundInBedspaceRooms'},
        transientPrivateRoomProperties: {$push: '$transientPrivateRoomProperties'},
        tenantsObjectIdInTransientPrivateRooms: {
          $push: '$tenantsObjectIdInTransientPrivateRoom',
        },
      }).addFields({
        isTenantObjectIdFoundInTransientPrivateRooms: {
          $in: [objectId(filter.tenantObjectId), '$tenantsObjectIdInTransientPrivateRooms'],
        },
      }).addFields({
        displayRoom: {
          $cond: {
            if: {
              $or: [
                {$eq: ['$isTenantObjectIdFoundInBedspaceRooms', true]},
                {$eq: ['$isTenantObjectIdFoundInTransientPrivateRooms', true]},
              ],
            },
            then: true,
            else: false,
          },
        },
      }).match({
        displayRoom: true,
      }).project({
        displayRoom: 0,
      });
      break;
  }
  return aggregate;
}

module.exports = aggregate;
