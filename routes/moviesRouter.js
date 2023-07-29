const moviesRouter = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/moviesController');
const { validateCreateMovieBody, validateDeleteMovieBody } = require('../middlewares/movieValidation');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', validateCreateMovieBody, createMovie);
moviesRouter.delete('/:_id', validateDeleteMovieBody, deleteMovie);

module.exports = moviesRouter;
