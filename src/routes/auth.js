/* eslint-disable new-cap */
const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth');
require('../config/passport')(passport);
module.exports = () => {
  authRoutes.post('/',
      passport.authenticate('local', {session: false}),
      authController.login,
  );

  authRoutes.get('/validate-token/',
      passport.authenticate('jwt', {session: false}),
      authController.validate
  );

  return authRoutes;
};
