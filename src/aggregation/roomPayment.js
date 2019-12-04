/* eslint-disable max-len */
const RoomPayment = require('../models/roomPayment');
const {FilterType} = require('../core/enums/filterType');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
/**
 * Aggregate the rooms collection.
 * @param {object} filter the object that contains the filter information.
 * @return {object} moongose agregated object.
 */
function aggregate(filter) {
  const aggregate = RoomPayment.aggregate();
  switch (filter.type) {
    case FilterType.ALLROOMPAYMENTS:
      aggregate.sort({
        roomNumber: 1,
        date: 1,
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.ROOMPAYMENTBYOBJECTID:
      aggregate.match({
        _id: objectId(filter.roomPaymentObjectId),
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.ADVANCESEARCHROOMPAYMENT:
      aggregate.addFields({
        roomTenantsIndex0: {
          $arrayElemAt: ['$roomTenants', 0],
        },
      }).addFields({
        tenantRentStatuses: '$roomTenantsIndex0.rentStatuses',
      }).addFields({
        rentStatuses: {
          $map: {
            input: '$tenantRentStatuses',
            as: 'status',
            in: {
              $cond: {
                if: {
                  $ne: ['$$status', null],
                },
                then: '$$status.value',
                else: false,
              },
            },
          },
        },
      }).addFields({
        rentStatus: {
          $cond: {
            if: {
              $ne: [filter.roomPaymentFilter.secondFilter.rentStatus, undefined],
            },
            then: {
              $in: [filter.roomPaymentFilter.secondFilter.rentStatus, '$rentStatuses'],
            },
            else: false,
          },
        },
      }).match(
          filter.roomPaymentFilter.firstFilter,
      ).project({
        roomTenantsIndex0: 0,
        tenantRentStatuses: 0,
        rentStatuses: 0,
        rentStatus: 0,
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.ROOMPAYMENTSINFOURMONTHS:
      aggregate.match({
        $or: filter.roomPaymentFilter,
      }).sort({
        roomNumber: 1,
        date: 1,
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
    case FilterType.ROOMPAYMENTSBYDATE:
      aggregate.match({
        date: filter.date,
      }).sort({
        roomNumber: 1,
        date: 1,
      }).project({
        created_at: 0,
        updatedAt: 0,
        __v: 0,
      });
      break;
  }
  return aggregate;
}

module.exports = aggregate;
