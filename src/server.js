const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const httpStatusCode = require('http-status-codes');

let logPath;
if (process.env.NODE_ENV === 'development') {
  logPath = '../log';
} else {
  logPath = 'log';
}

const port = process.env.PORT;
const logDirectory = path.join(__dirname, logPath);
// if directory does not exist make directory
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// for logging client incoming request and err request
const accessLogStream = rfs('access.log', {
  interval: '1h', // rotate hourly
  path: path.join(logDirectory, 'access'),
});

const errorLogStream = rfs('error.log', {
  interval: '1h', // rotate hourly
  path: path.join(logDirectory, 'error'),
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '5mb'}));

app.use(
    morgan('combined', {
      skip(req, res) {
        return res.statusCode < 400;
      },
      stream: errorLogStream,
    }),
);

app.use(
    morgan('combined', {
      skip(req, res) {
        return res.statusCode >= 400;
      },
      stream: accessLogStream,
    }),
);

// set up mongo db with moongose
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
mongoose.set('useFindAndModify', false);
const dbConnection = mongoose.connection;
dbConnection.on('error', console.error.bind(console, 'connection error: '));
dbConnection.once('open', () => {
  console.log('Mongo db connected!');
});

const routes = require('./routes');
app.use(routes());

app.use((err, req, res, next) => {
  if (err) {
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: err.message,
      stackTrace: err.stack,
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
