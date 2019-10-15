const httpStatusCode = require('http-status-codes');

module.exports = {
  serverStatus: (req, res) => {
    res.status(httpStatusCode.OK).send('Server is running');
  },
};
