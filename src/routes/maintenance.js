// eslint-disable-next-line new-cap
const maintenanceRoutes = require('express').Router();
const maintenanceController = require('../controllers/maintenance');
module.exports = () => {
  maintenanceRoutes.get('/server-status', maintenanceController.serverStatus);

  return maintenanceRoutes;
};
