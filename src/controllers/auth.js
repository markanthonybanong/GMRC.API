const httpStatusCode = require('http-status-codes');
// const jwt = require('jsonwebtoken');
const JWT = require('../utils/jwt/token');
exports.superAdminLogin = async (req, res) => {
  const token = JWT.signSuperAdminToken(req.user._id);
  res.status(httpStatusCode.OK).send({
    token: token,
  });
};
exports.adminLogin = async (req, res) => {
  const token = JWT.signAdminToken(req.user._id);
  res.status(httpStatusCode.OK).send({
    token: token,
  });
};
