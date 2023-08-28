require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const { requestsLogger, errorsLogger } = require('./middlewares/logger');
const mainRouter = require('./routes/mainRouter');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
mongoose.connect(DB_URL);
const allowedCors = [
  'http://localhost:3000',
];
const allowedMethods = 'GET,HEAD,PUT,PATCH,POST,DELETE';

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestsLogger);
app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', allowedMethods);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});
app.use(mainRouter);
app.use(errorsLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, 'localhost');
