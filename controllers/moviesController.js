const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const DefaultError = require('../errors/DefaultError');
const IncorrectInputError = require('../errors/IncorrectInputError');
const ConflictError = require('../errors/ConflictError');

function getMovies(req, res, next) {
  Movie.find({})
    .populate('owner')
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      next(new DefaultError('На сервере произошла ошибка'));
    });
}

function createMovie(req, res, next) {
  const userId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: userId,
  })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      } else {
        next(new DefaultError('На сервере произошла ошибка'));
      }
    });
}

function deleteMovie(req, res, next) {
  const userId = req.user._id;
  const movieId = req.params._id;

  Movie.findById(movieId)
    .then((result) => {
      if (result.owner._id.toString() !== userId) {
        return next(new ConflictError('Ошибка! Вы не можете удалить этот фильм, так как не являетесь его модератором'));
      }

      return Movie.deleteOne(result)
        .then((deletedMovie) => {
          if (deletedMovie) {
            return res.send({ status: 'OK' });
          }

          return next(new DefaultError('На сервере произошла ошибка'));
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      } else {
        next(new DefaultError('На сервере произошла ошибка'));
      }
    });
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
