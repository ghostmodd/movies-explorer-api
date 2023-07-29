const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'simpleSecretKey' } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');

function authentication(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    return next(new UnauthorizedError('Ошибка: необходимо авторизоваться!'));
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Ошибка: не удалось авторизоваться!'));
  }

  req.user = payload;
  return next();
}

module.exports = authentication;
