/* eslint-disable max-len */
const jwt = require('jsonwebtoken');

exports.signSuperAdminToken = (id) => jwt.sign({
  iss: 'GMRC',
  sub: id,
  iat: new Date().getTime(), // current time in milliseconds
  exp: Math.floor(Date.now() / 1000) + (60 * 540), // add 9 hour to current date time
},
process.env.JWT_SECRET,
);

exports.signAdminToken = (id) => jwt.sign({
  iss: 'GMRC',
  sub: id,
  iat: new Date().getTime(), // current time in milliseconds
  exp: Math.floor(Date.now() / 1000) + (2 * 3600), // add 2 hour to current date time
},
process.env.JWT_SECRET,
);

