// eslint-disable-next-line new-cap
const paymentRoutes = require('express').Router();
const paymentController = require('../controllers/payment');
module.exports = () => {
  paymentRoutes.post('/createEntry', paymentController.createEntry);

  return paymentRoutes;
};
