require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { requestsLogger, errorsLogger } = require('./middlewares/logger');
const mainRouter = require('./routes/mainRouter');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
mongoose.connect(DB_URL);

app.use(
  helmet({
    crossOriginOpenerPolicy: false,
  }),
);
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
app.use(mainRouter);
app.use(errorsLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, 'localhost');
