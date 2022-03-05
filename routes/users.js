// routes/users.js
// это файл маршрутов

const routerUsers = require('express').Router(); // создали роутер
const {
  createUser, getUserID, getUsers, updateProfileUser, updateAvatarUser,
} = require('../controllers/users');

routerUsers.get('/users/:id', getUserID);
routerUsers.get('/users', getUsers);
routerUsers.post('/users', createUser);
routerUsers.patch('/users/me', updateProfileUser);
routerUsers.patch('/users/me/avatar', updateAvatarUser);

module.exports = routerUsers; // экспортировали роутер
