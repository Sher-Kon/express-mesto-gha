// models/user.js
// это файл моделей

const { isEmail } = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String, // это строка
    required: true,
    unique: true, // уникальный
    validate: {
      validator: isEmail,
      message: '{VALUE} is not a valid email',
      isAsync: false,
    },
  },
  password: {
    type: String, // это строка
    required: true,
    select: false,
    minlength: 8,
  },
  name: { // имя пользователя:
    type: String, // это строка
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Жак-Ив Кусто',
  },
  about: { // информация о пользователе:
    type: String, //  это строка
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Исследователь',
  },
  avatar: { //  ссылка на аватарку:
    type: String, // это строка
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 200, // а максимальная — 200 символов
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',

    validate: {
      validator: function(v) {
        return /^https?:\/\/(www.)?[0-9a-zA-Z\/\-]+\.[0-9a-zA-Z\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\#?$/.test(v);
      },
      message: props => `Переданы некорректные данные ссылки аватара!`
    },
  },
});

// для populate() - по ref обязателен user
module.exports = mongoose.model('user', userSchema);

    /*
        validator{(
          validate: 'matches',
          arguments: /^https?:\/\/(www.)?[0-9a-zA-Z\/\-]+\.[0-9a-zA-Z\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\#?$/,
        }),
    */
