const movieRouters = require('express').Router();

const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

const {
  validationCreateMovie,
  validationDeleteMovie,
} = require('../middlewares/validation');

movieRouters.get('/', getMovies);
movieRouters.delete('/:id', validationDeleteMovie, deleteMovie);
movieRouters.post('/', validationCreateMovie, createMovie);

module.exports = movieRouters;
