// eslint-disable-next-line new-cap
const paymentRoutes = require('express').Router();
const paymentController = require('../controllers/payment');
module.exports = () => {
  paymentRoutes.post('/createEntry', paymentController.createEntry);

  paymentRoutes.post('/page', paymentController.getEntries);

  paymentRoutes.put('/updateEntry/:id', paymentController.updateEntry);

  return paymentRoutes;
};
