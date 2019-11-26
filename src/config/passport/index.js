const passport = require('passport');
const setJwtStrategy = require('./passport-jwt');
const setLocalStrategy = require('./passport-local');

module.exports = (app) => {
  setJwtStrategy(passport);
  setLocalStrategy(passport);
  app.use(passport.initialize());
};
