/* eslint-disable max-len */
// eslint-disable-next-line new-cap
const roomRoutes = require('express').Router();
const roomController = require('../controllers/room');
module.exports = () => {
  roomRoutes.post('/createRoom', roomController.create);

  roomRoutes.put('/updateRoom', roomController.update);

  roomRoutes.post('/createBed', roomController.createBed);

  roomRoutes.post('/createBedspace', roomController.createBedspace);

  roomRoutes.put('/updateBedspace', roomController.updateBedspace);

  roomRoutes.put('/removeBedspace', roomController.removeBedspace);

  roomRoutes.put('/removeDeckInBedspace', roomController.removeDeckInBedspace);

  roomRoutes.post('/addTenantInTransientPrivateRoom', roomController.addTenantInTransientPrivateRoom);

  roomRoutes.put('/updateTenantInTransientPrivateRoom', roomController.updateTenantInTransientPrivateRoom);

  roomRoutes.put('/removeTenantInTransientPrivateRoom', roomController.removeTenantInTransientPrivateRoom);

  roomRoutes.post('/getTransientPrivateRoomByTenantsObjectId', roomController.getTransientPrivateRoomByTenantsObjectId);

  roomRoutes.post('/page', roomController.getRooms);

  return roomRoutes;
};
