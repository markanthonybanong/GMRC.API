/* eslint-disable max-len */
// eslint-disable-next-line new-cap
const roomRoutes = require('express').Router();
const roomController = require('../controllers/room');
module.exports = () => {
  roomRoutes.post('/createRoom', roomController.create);

  roomRoutes.put('/updateRoom', roomController.update);

  roomRoutes.post('/createBed', roomController.createBed);

  roomRoutes.post('/createDeckInBed', roomController.createDeckInBed);

  roomRoutes.put('/updateDeckInBed', roomController.updateDeckInBed);

  roomRoutes.put('/addUpdateAwayInDeck', roomController.addUpdateAwayInDeck);

  roomRoutes.put('/removeBedspace', roomController.removeBedspace);

  roomRoutes.put('/removeDeckInBedspace', roomController.removeDeckInBedspace);

  roomRoutes.post('/addTenantInTransientPrivateRoom', roomController.addTenantInTransientPrivateRoom);

  roomRoutes.put('/removeTenantInTransientPrivateRoom', roomController.removeTenantInTransientPrivateRoom);

  roomRoutes.post('/getTransientPrivateRoomByTenantsObjectId', roomController.getTransientPrivateRoomByTenantsObjectId);

  roomRoutes.post('/page', roomController.getRooms);

  roomRoutes.post('/unsettle-bill', roomController.createUnsettleBill);

  roomRoutes.put('/unsettle-bill', roomController.updateUnsettleBill);

  roomRoutes.post('/unsettle-bill/page', roomController.getUnsettleBills);

  roomRoutes.put('/removeTenantInUnsettleBill', roomController.removeTenantInUnsettleBill);

  roomRoutes.delete('/removeUnsettleBill/:id', roomController.removeUnsettleBill);

  return roomRoutes;
};
