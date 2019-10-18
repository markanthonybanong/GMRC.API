const httpStatusCode = require('http-status-codes');
const jwt = require('jsonwebtoken');
const JWT = require('../utils/jwt');
exports.login = async (req, res) => {
  const token = JWT.signToken(req.user._id);
  const decodeToken = jwt.decode(token);

  res.status(httpStatusCode.OK).json({
    token: token,
    tokenExp: decodeToken.exp,
  });
};

exports.validate = async (req, res) => {
  res.status(httpStatusCode.OK).send(true);
};
