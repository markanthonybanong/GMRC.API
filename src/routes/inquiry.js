// eslint-disable-next-line new-cap
const inquiryRoutes = require('express').Router();
const inquiryController = require('../controllers/inquiry');
module.exports = () => {
  inquiryRoutes.post('/', inquiryController.create);

  inquiryRoutes.put('/:id', inquiryController.update);

  inquiryRoutes.post('/page', inquiryController.getInquiries);

  inquiryRoutes.delete('/remove/:id', inquiryController.remove);

  return inquiryRoutes;
};
