// models/user.js
// это файл моделей
// var validator = require('validator');

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    // minlength: 2, // минимальная длина — 2 символа
    // maxlength: 200, // а максимальная — 200 символов
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String, // это строка
    required: true,
    unique: true, // уникальный
    // validator.isEmail('foo@bar.com'); //=> true
  },
  password: {
    type: String, // это строка
    required: true,
    select: false,
    minlength: 8,
  },
});

// для populate() - по ref обязателен user
module.exports = mongoose.model('user', userSchema);
