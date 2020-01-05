// eslint-disable-next-line new-cap
const userRoutes = require('express').Router();
const userController = require('../controllers/user');
module.exports = () => {
  userRoutes.post('/createAdmin', userController.createAdmin);

  userRoutes.post('/createSuperAdmin', userController.createSuperAdmin);

  return userRoutes;
};
