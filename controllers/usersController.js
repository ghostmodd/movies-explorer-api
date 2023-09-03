const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const DefaultError = require('../errors/DefaultError');
const NotFoundError = require('../errors/NotFoundError');
const IncorrectInputError = require('../errors/IncorrectInputError');
const ConflictError = require('../errors/ConflictError');

// для работы функции нужно доделать аутентификацию пользователя!!!!!!!
function getUserInfo(req, res, next) {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Ошибка! Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch(() => {
      next(new DefaultError('На сервере произошла ошибка!'));
    });
}

function createUser(req, res, next) {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((token) => {
      User.create({
        email,
        password: token,
        name,
      })
        .then((user) => {
          res.send({
            user: {
              name: user.name,
              email: user.email,
            },
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Ошибка: пользователь с введенным email уже существует'));
          } else if (err instanceof mongoose.Error.ValidationError) {
            next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
          } else {
            next(new DefaultError('На сервере произошла ошибка'));
          }
        });
    });
}

function updateUserInfo(req, res, next) {
  const { name, email } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    {
      [name ? 'name' : null]: name,
      [email ? 'email' : null]: email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Ошибка: пользователь с введенным email уже существует'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        return next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      }

      return next(new DefaultError('На сервере произошла ошибка'));
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((token) => {
      res.cookie(
        'token',
        token,
        {
          maxAge: 60480000,
          sameSite: "none",
          secure: true,
        },
      );

      res.send({ message: 'Авторизация успешна!' });
    })
    .catch((err) => {
      next(err);
    });
}

function logout(req, res, next) {
  try {
    res.clearCookie('token', {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      domain: "http://ghostmodd.nomoredomainsicu.ru/",
    });
    res.send({ message: 'OK' });
  } catch (err) {
    next(new DefaultError('На сервере произошла ошибка'));
  }
}

module.exports = {
  getUserInfo,
  createUser,
  updateUserInfo,
  login,
  logout,
};
