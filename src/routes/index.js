/* eslint-disable new-cap */
const passport = require('passport');
const routes = require('express').Router();
const maintenanceRoutes = require('./maintenance');
const roomRoutes = require('./room');
const tenantRoutes = require('./tenant');
const inquiryRoutes = require('./inquiry');
const paymentRoutes = require('./payment');
const userRoutes = require('./user');
const authRoutes = require('./auth');
module.exports = () => {
  routes.use(
      '/api/maintenance',
      maintenanceRoutes(),
  );

  routes.use(
      '/api/user',
      userRoutes(),
  );

  routes.use(
      '/api/auth',
      authRoutes(),
  );

  routes.use(
      '/api/room',
      passport.authenticate('jwt', {session: false}),
      roomRoutes(),
  );

  routes.use(
      '/api/tenant',
      passport.authenticate('jwt', {session: false}),
      tenantRoutes(),
  );

  routes.use(
      '/api/inquiry',
      passport.authenticate('jwt', {session: false}),
      inquiryRoutes(),
  );

  routes.use(
      '/api/payment',
      passport.authenticate('jwt', {session: false}),
      paymentRoutes(),
  );

  return routes;
};

