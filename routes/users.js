const userRouters = require('express').Router();
const {
  updateUser, getUserMe,
} = require('../controllers/users');
const {
  validationUpdateUser,
} = require('../middlewares/validation');

// Роуты пользователя
userRouters.get('/me', getUserMe);
userRouters.patch('/me', validationUpdateUser, updateUser);

module.exports = userRouters;
