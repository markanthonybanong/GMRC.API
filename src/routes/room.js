/* eslint-disable max-len */
// eslint-disable-next-line new-cap
const roomRoutes = require('express').Router();
const roomController = require('../controllers/room');
module.exports = () => {
  roomRoutes.post('/createRoom', roomController.create);

  roomRoutes.put('/updateRoom', roomController.update);

  roomRoutes.post('/createBedspace', roomController.createBedspace);

  roomRoutes.put('/updateBedspace', roomController.updateBedspace);

  roomRoutes.put('/removeBedspace', roomController.removeBedspace);

  roomRoutes.put('/removeDeckInBedspace', roomController.removeDeckInBedspace);

  roomRoutes.post('/page', roomController.getRooms);

  roomRoutes.put('/removeTenantInTransientPrivateRoom', roomController.removeTenantInTransientPrivateRoom);

  return roomRoutes;
};
