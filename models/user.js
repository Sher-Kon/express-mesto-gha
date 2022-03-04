// models/user.js
// это файл моделей

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // имя пользователя:
    type: String, // это строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  about: { // информация о пользователе:
    type: String, //  это строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  avatar: { //  ссылка на аватарку:
    type: String, // это строка
    required: true, // обязательное поле
    //minlength: 2, // минимальная длина — 2 символа
    //maxlength: 200, // а максимальная — 200 символов
  }
});


// для populate() - по ref обязателен user
module.exports = mongoose.model('user', userSchema);
