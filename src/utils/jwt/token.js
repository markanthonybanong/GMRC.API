/* eslint-disable max-len */
const jwt = require('jsonwebtoken');
const {UserTypes} = require('../../core/enums/userType');
exports.signSuperAdminToken = (id) => jwt.sign({
  iss: 'GMRC',
  userType: UserTypes.SUPERADMIN,
  sub: id,
  iat: new Date().getTime(), // current time in milliseconds
  exp: Math.floor(Date.now() / 1000) + (60 * 540), // add 9 hour to current date time
},
process.env.JWT_SECRET,
);

exports.signAdminToken = (id) => jwt.sign({
  iss: 'GMRC',
  userType: UserTypes.ADMIN,
  sub: id,
  iat: new Date().getTime(), // current time in milliseconds
  exp: Math.floor(Date.now() / 1000) + (2 * 3600), // add 2 hour to current date time
},
process.env.JWT_SECRET,
);

