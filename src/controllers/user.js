/* eslint-disable max-len */
const httpStatusCode = require('http-status-codes');
const User = require('../models/user');
const hash = require('../utils/password');
exports.create = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  const user = new User({
    email: email,
    password: hash.generate(password),
  });
  user.save( (err, user) => {
    if (err) {
      res.status(httpStatusCode.BAD_REQUEST)
          .send({
            message: err,
          });
    } else {
      res.status(httpStatusCode.OK)
          .send(`User created email:"${user.email}" password:"${user.password}"`);
    }
  });
};
