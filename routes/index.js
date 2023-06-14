const express = require('express');

const router = express.Router();

const userRouters = require('./users');
const movieRouters = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFound-error');
const { validationCreateUser, validationLogin } = require('../middlewares/validation');
const { createUser, login, logout } = require('../controllers/users');

// router.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);
router.post('/signout', logout);

// router.use(auth);

router.use('/users', auth, userRouters);
router.use('/movies', auth, movieRouters);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
