// eslint-disable-next-line new-cap
const roomAccountRoutes = require('express').Router();
const roomAccountController = require('../controllers/roomAccount');
module.exports = () => {
  roomAccountRoutes.post('/', roomAccountController.create);

  roomAccountRoutes.put('/', roomAccountController.update);

  roomAccountRoutes.post('/page', roomAccountController.getRoomAccounts);

  return roomAccountRoutes;
};
