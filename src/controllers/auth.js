const httpStatusCode = require('http-status-codes');
const jwt = require('jsonwebtoken');
const JWT = require('../utils/jwt');
exports.superAdminLogin = async (req, res) => {
  const token = JWT.signSuperAdminToken(req.user._id);
  const decodeToken = jwt.decode(token);
  res.status(httpStatusCode.OK).send({
    token: token,
    tokenExp: decodeToken.exp,
  });
};
exports.adminLogin = async (req, res) => {
  const token = JWT.signAdminToken(req.user._id);
  const decodeToken = jwt.decode(token);
  res.status(httpStatusCode.OK).send({
    token: token,
    tokenExp: decodeToken.exp,
  });
};

exports.validate = async (req, res) => {
  res.status(httpStatusCode.OK).send(true);
};
