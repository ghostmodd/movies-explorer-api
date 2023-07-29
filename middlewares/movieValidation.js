const { celebrate, Joi } = require('celebrate');

const urlRegexp = /^https?:\/\/[0-9a-zA-Z/\-._~:?#[\]@!$&'()*+,;=]{5,}$/;
const validateCreateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegexp),
    trailerLink: Joi.string().required().pattern(urlRegexp),
    thumbnail: Joi.string().required().pattern(urlRegexp),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
const validateDeleteMovieBody = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).pattern(/[a-z0-9]{24}/m).required(),
  }),
});

module.exports = {
  validateCreateMovieBody,
  validateDeleteMovieBody,
};
