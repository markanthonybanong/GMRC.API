// eslint-disable-next-line new-cap
const routes = require('express').Router();
const maintenanceRoutes = require('./maintenance');
const roomRoutes = require('./room');
const tenantRoutes = require('./tenant');
const inquiryRoutes = require('./inquiry');
module.exports = () => {
  routes.use(
      '/api/maintenance',
      maintenanceRoutes(),
  );

  routes.use(
      '/api/room',
      roomRoutes(),
  );

  routes.use(
      '/api/tenant',
      tenantRoutes(),
  );

  routes.use(
      '/api/inquiry',
      inquiryRoutes(),
  );
  return routes;
};

