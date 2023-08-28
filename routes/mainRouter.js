const mainRouter = require('express').Router();
const usersRouter = require('./usersRouter');
const moviesRouter = require('./moviesRouter');
const { validateCreateUser, validateLogin } = require('../middlewares/userValidation');
const { createUser, login, logout } = require('../controllers/usersController');
const authentication = require('../middlewares/authentication');
const NotFoundError = require('../errors/NotFoundError');

mainRouter.post('/signup', validateCreateUser, createUser);
mainRouter.post('/signin', validateLogin, login);
mainRouter.post('/signout', authentication, logout);
mainRouter.use('/users', authentication, usersRouter);
mainRouter.use('/movies', authentication, moviesRouter);
mainRouter.use((req, res, next) => {
  next(new NotFoundError('Ошибка! Страница не найдена.'));
});

module.exports = mainRouter;
