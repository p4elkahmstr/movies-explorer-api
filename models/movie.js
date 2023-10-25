const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле "country" не заполнено'],
  },
  director: {
    type: String,
    required: [true, 'Поле "director" не заполнено'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле "duration" не заполнено'],
  },
  year: {
    type: String,
    required: [true, 'Поле "year" не заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле "description" не заполнено'],
  },
  image: {
    type: String,
    required: [true, 'Поле "image" не заполнено'],
    validate: {
      validator(v) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(v);
      },
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Поле "trailerLink" не заполнено'],
    validate: {
      validator(v) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(v);
      },
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле "thumbnail" не заполнено'],
    validate: {
      validator(v) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: [true, 'Поле "nameRU" не заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле "nameEN" не заполнено'],
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
