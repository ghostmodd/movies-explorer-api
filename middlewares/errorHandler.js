function errorHandler(err, req, res, next) {
  console.log(err)
  res.status(err.statusCode).send({ message: err.message });
  next();
}

module.exports = errorHandler;
