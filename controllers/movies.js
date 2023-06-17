const { StatusCodes } = require('http-status-codes');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/badRequest-error');
const NotFoundError = require('../errors/notFound-error');
const ForbiddenError = require('../errors/forbidden-error');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Фильм не найден');
      }
      res.status(StatusCodes.OK).send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ owner, ...req.body })
    .then((movie) => {
      res.status(StatusCodes.CREATED).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при добавлении фильма'));
      } else {
        next(err);
      }
    });
};

function deleteMovie(req, res, next) {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (req.user._id !== movie.owner._id.toString()) {
        throw new ForbiddenError('У вас нет прав на удаление фильма');
      }
      return Movie.findByIdAndDelete(movie);
    })
    .then(() => res.send({ message: 'Фильм удален' }))
    .catch(next);
}

// Экспорт модулей
module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
