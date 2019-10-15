// eslint-disable-next-line new-cap
const tenantRoutes = require('express').Router();
const tenantController = require('../controllers/tenant');
module.exports = () => {
  tenantRoutes.post('/', tenantController.create);

  tenantRoutes.put('/:id', tenantController.update);

  tenantRoutes.post('/page', tenantController.getTenants);

  return tenantRoutes;
};
