// routes/users.js
// это файл маршрутов

const { celebrate, Joi } = require('celebrate');
const routerUsers = require('express').Router(); // создали роутер

const {
  // createUser,
  getUserID,
  getUsers,
  updateProfileUser,
  updateAvatarUser,
  getUserAuth,
} = require('../controllers/users');

routerUsers.get('/users/me', getUserAuth);
routerUsers.get('/users/:id', getUserID);
routerUsers.get('/users', getUsers);
// routerUsers.patch('/users/me', updateProfileUser);
routerUsers.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), updateProfileUser);

// routerUsers.patch('/users/me/avatar', updateAvatarUser);
routerUsers.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/),
  }).unknown(true),
}), updateAvatarUser);

module.exports = routerUsers; // экспортировали роутер
// pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/),
