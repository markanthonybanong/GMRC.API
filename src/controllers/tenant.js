const httpStatusCode = require('http-status-codes');
const Tenant = require('../models/tenant');
const tenantAggregate = require('../aggregation/tenant');

exports.create = async (req, res) => {
  const {
    firstname,
    middlename,
    lastname,
    roomNumber,
    dueRentDate,
    age,
    gender,
    typeOfNetwork,
    contactNumber,
    emergencyContactNumber,
    address,
  } = req.body;
  const tenant = new Tenant({
    firstname: firstname,
    middlename: middlename,
    lastname: lastname,
    roomNumber: roomNumber,
    dueRentDate: dueRentDate,
    age: age,
    gender: gender,
    typeOfNetwork: typeOfNetwork,
    contactNumber, emergencyContactNumber,
    address: address,
  });
  tenant.save( (err, tenant) => {
    if (err) {
      res.status(httpStatusCode.BAD_REQUEST)
          .send({
            message: err,
          });
    } else {
      res.status(httpStatusCode.OK)
          .json(tenant);
    }
  });
};
exports.update = async (req, res) => {
  const {
    firstname,
    middlename,
    lastname,
    roomNumber,
    dueRentDate,
    age,
    gender,
    typeOfNetwork,
    contactNumber,
    emergencyContactNumber,
    address,
  } = req.body;
  const {id: tenantId} = req.params;
  Tenant.findByIdAndUpdate(tenantId,
      {
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        roomNumber: roomNumber,
        dueRentDate: dueRentDate,
        age: age,
        gender: gender,
        typeOfNetwork: typeOfNetwork,
        contactNumber: contactNumber,
        emergencyContactNumber: emergencyContactNumber,
        address: address,
      },
      {new: true},
      (err, tenant) => {
        if (err) {
          res.status(httpStatusCode.BAD_REQUEST)
              .send({
                message: err,
              });
        } else {
          res.status(httpStatusCode.OK)
              .json(tenant);
        }
      }
  );
};
exports.getTenants = async (req, res) => {
  const options = {
    page: req.body.page,
    limit: req.body.limit,
  };
  Tenant.aggregatePaginate(tenantAggregate(req.body.filters), options)
      .then( (tenants) => {
        res.status(httpStatusCode.OK)
            .send({
              data: tenants.data,
              pageCount: tenants.pageCount,
              totalCount: tenants.totalCount,
            });
      })
      .catch((err) => {
        res.status(httpStatusCode.BAD_REQUEST)
            .send({
              message: err,
            });
      });
};
