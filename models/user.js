const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { Unauthorized } = require('http-errors');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  // Ищем пользователя по почте
  return this.findOne({ email }).select('+password')
    .then((user) => {
      // Не нашелся - отклоняем промис
      if (!user) {
        return Promise.reject(new Unauthorized('Неправильный email или пароль.'));
      }
      // нашелся -сравниваем хэши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Неправильный email или пароль.'));
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
