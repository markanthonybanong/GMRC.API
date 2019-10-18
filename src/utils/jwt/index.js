/* eslint-disable max-len */
const jwt = require('jsonwebtoken');

exports.signToken = (id) => jwt.sign({
  iss: 'GMRC',
  sub: id,
  iat: new Date().getTime(), // current time in milliseconds
  exp: Math.floor(Date.now() / 1000) + (60 * 180), // add 3 hour to current date time
},
process.env.JWT_SECRET,
);
