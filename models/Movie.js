const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (imgLink) => { /^https?:\/\/[0-9a-zA-Z/\-._~:?#[\]@!$&'()*+,;=]{5,}$/gm.test(imgLink); },
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (trailerLink) => { /^https?:\/\/[0-9a-zA-Z/\-._~:?#[\]@!$&'()*+,;=]{5,}$/gm.test(trailerLink); },
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (thumbnailLink) => { /^https?:\/\/[0-9a-zA-Z/\-._~:?#[\]@!$&'()*+,;=]{5,}$/gm.test(thumbnailLink); },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
