/* eslint-disable max-len */
const httpStatusCode = require('http-status-codes');
const AdminUser = require('../models/adminUser');
const SuperAdminUser = require('../models/superAdminUser');
const hash = require('../utils/password');
exports.createAdmin = async (req, res) => {
  const user = new AdminUser({
    password: hash.generate(req.body.numberString),
  });
  user.save( (err, user) => {
    if (err) {
      res.status(httpStatusCode.BAD_REQUEST)
          .send({
            message: err,
          });
    } else {
      res.status(httpStatusCode.OK)
          .json(user);
    }
  });
};

exports.createSuperAdmin = async (req, res) => {
  const user = new SuperAdminUser({
    password: hash.generate(req.body.password),
  });

  user.save( (err, user) => {
    if (err) {
      res.status(httpStatusCode.BAD_REQUEST)
          .send({
            message: err,
          });
    } else {
      res.status(httpStatusCode.OK)
          .json(user);
    }
  });
};
