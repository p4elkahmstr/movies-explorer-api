const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movie');
const { VALIDATION_ERROR, MOVIE_NOT_FOUND, ACCESS_DENIED, INCORRECT_MOVIE_ID } = require('../utils/movieErrors');

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, movieId, thumbnail,
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
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(VALIDATION_ERROR));
        return;
      }
      next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(MOVIE_NOT_FOUND);
      } if (`${movie.owner}` !== req.user._id) {
        throw new ForbiddenError(ACCESS_DENIED);
      } else {
        return Movie.findByIdAndRemove(req.params.movieId);
      }
    })
    .then(() => {
      res.send({ message: 'Фильм удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(INCORRECT_MOVIE_ID));
      } else {
        next(err);
      }
    });
};
