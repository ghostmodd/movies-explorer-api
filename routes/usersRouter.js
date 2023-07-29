const usersRouter = require('express').Router();
const { validateUpdateUserInfo } = require('../middlewares/userValidation');
const { getUserInfo, updateUserInfo } = require('../controllers/usersController');

usersRouter.get('/me', getUserInfo);
usersRouter.patch('/me', validateUpdateUserInfo, updateUserInfo);

module.exports = usersRouter;
