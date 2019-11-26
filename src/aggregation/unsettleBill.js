/* eslint-disable max-len */
const UnsettleBill = require('../models/unsettleBill');
const {FilterType} = require('../core/enums/filterType');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
/**
 * Aggregate the rooms collection.
 * @param {object} filter the object that contains the filter information.
 * @return {object} moongose agregated object.
 */
function aggregate(filter) {
  const aggregate = UnsettleBill.aggregate();
  switch (filter.type) {
    case FilterType.ALLUNSETTLEBILLS:
      aggregate.lookup({
        from: 'tenants',
        localField: 'tenants',
        foreignField: '_id',
        as: 'tenants',
      }).sort({
        roomNumber: 1,
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.UNSETTLEBILLBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.unsettleBillObjectId),
      }).lookup({
        from: 'tenants',
        localField: 'tenants',
        foreignField: '_id',
        as: 'tenants',
      }).sort({
        roomNumber: 1,
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.ADVANCESEARCHUNSETTLEBILL:
      aggregate.project({
        tenants: 1,
        roomNumber: 1,
        roomType: 1,
        dueDate: 1,
        dateExit: 1,
        rentBalance: 1,
        electricBillBalance: 1,
        waterBillBalance: 1,
        riceCookerBillBalance: 1,
        isRoomNumberFound: {
          $cond: {
            if: {
              $eq: ['$roomNumber', filter.unsettleBillFilter.roomNumber],
            },
            then: true,
            else: false,
          },
        },
        isRoomTypeFound: {
          $cond: {
            if: {
              $eq: ['$roomType', filter.unsettleBillFilter.roomType],
            },
            then: true,
            else: false,
          },
        },
        isTenantObjectIdFound: {
          $in: [objectId(filter.unsettleBillFilter.tenantObjectId), '$tenants'],
        },
      }).project({
        isRoomNumberFound: 1,
        isRoomTypeFound: 1,
        isTenantObjectIdFound: 1,
        tenants: 1,
        roomNumber: 1,
        roomType: 1,
        dueDate: 1,
        dateExit: 1,
        rentBalance: 1,
        electricBillBalance: 1,
        waterBillBalance: 1,
        riceCookerBillBalance: 1,
        displayRoom: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {$ne: [filter.unsettleBillFilter.roomNumber, null]},
                    {$ne: [filter.unsettleBillFilter.roomType, null]},
                    {$ne: [filter.unsettleBillFilter.tenantObjectId, null]},
                  ],
                },
                then: {
                  $cond: {
                    if: {
                      $and: [
                        {$eq: ['$isRoomNumberFound', true]},
                        {$eq: ['$isRoomTypeFound', true]},
                        {$eq: ['$isTenantObjectIdFound', true]},
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
                    {$ne: [filter.unsettleBillFilter.roomNumber, null]},
                    {$ne: [filter.unsettleBillFilter.roomType, null]},
                    {$eq: [filter.unsettleBillFilter.tenantObjectId, null]},
                  ],
                },
                then: {
                  $cond: {
                    if: {
                      $and: [
                        {$eq: ['$isRoomNumberFound', true]},
                        {$eq: ['$isRoomTypeFound', true]},
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
                    {$ne: [filter.unsettleBillFilter.roomNumber, null]},
                    {$eq: [filter.unsettleBillFilter.roomType, null]},
                    {$ne: [filter.unsettleBillFilter.tenantObjectId, null]},
                  ],
                },
                then: {
                  $cond: {
                    if: {
                      $and: [
                        {$eq: ['$isRoomNumberFound', true]},
                        {$eq: ['$isTenantObjectIdFound', true]},
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
                    {$eq: [filter.unsettleBillFilter.roomNumber, null]},
                    {$ne: [filter.unsettleBillFilter.roomType, null]},
                    {$ne: [filter.unsettleBillFilter.tenantObjectId, null]},
                  ],
                },
                then: {
                  $cond: {
                    if: {
                      $and: [
                        {$eq: ['$isRoomTypeFound', true]},
                        {$eq: ['$isTenantObjectIdFound', true]},
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
                    {$ne: [filter.unsettleBillFilter.roomNumber, null]},
                    {$ne: [filter.unsettleBillFilter.roomType, null]},
                    {$ne: [filter.unsettleBillFilter.tenantObjectId, null]},
                  ],
                },
                then: {
                  $cond: {
                    if: {
                      $or: [
                        {$eq: ['$isRoomNumberFound', true]},
                        {$eq: ['$isRoomTypeFound', true]},
                        {$eq: ['$isTenantObjectIdFound', true]},
                      ],
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
      }).lookup({
        from: 'tenants',
        localField: 'tenants',
        foreignField: '_id',
        as: 'tenants',
      }).sort({
        roomNumber: 1,
      }).project({
        displayRoom: 0,
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
  }
  return aggregate;
}

module.exports = aggregate;
