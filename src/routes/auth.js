/* eslint-disable new-cap */
const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth');
require('../config/passport')(passport);
module.exports = () => {
  authRoutes.post('/superAdminLogin',
      passport.authenticate('localSuperAdmin', {session: false}),
      authController.superAdminLogin,
  );

  authRoutes.post('/adminLogin',
      passport.authenticate('localAdmin', {session: false}),
      authController.adminLogin,
  );

  return authRoutes;
};
