// eslint-disable-next-line new-cap
const paymentRoutes = require('express').Router();
const paymentController = require('../controllers/payment');
module.exports = () => {
  paymentRoutes.post('/createEntry', paymentController.createEntry);

  paymentRoutes.post('/entry/page', paymentController.getEntries);

  paymentRoutes.put('/updateEntry/:id', paymentController.updateEntry);

  paymentRoutes.post('/createRoomPayment', paymentController.createRoomPayment);

  paymentRoutes.post('/roomPayment/page', paymentController.getRoomPayments);

  paymentRoutes.put('/updateRoomPayment/:id', paymentController.updateRoomPayment);

  return paymentRoutes;
};
