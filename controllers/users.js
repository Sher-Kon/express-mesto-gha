// controllers/users.js
// это файл контроллеров

const User = require('../models/user');

module.exports.getUserID = (req, res) => {
  User.findById(req.params.id)// запрос одного
    .then((users) => {
      if (!users) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });// выдавать ошибку 404
      } else {
        res.send({
          about: users.about,
          avatar: users.avatar,
          name: users.name,
          _id: users.id,
        });
      }
    })
    .catch((err) => {
      // console.dir(err);
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id ' });
      } else {
        res.status(500).send({ message: 'Пользователь по указанному _id не найден' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({}) // запрос всех
    .then((users) => res.send(users))//
    .catch(() => {
      // console.dir(err);
      res.status(500).send({ message: 'Ошибка чтения всех пользователей' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({
      about: user.about,
      avatar: user.avatar,
      name: user.name,
      _id: user.id,
    }))
    .catch((err) => {
      // console.dir(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
    });
};

module.exports.updateProfileUser = (req, res) => {
  const { name, about } = req.body;
  // обновим имя, найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send({
      about: user.about,
      avatar: user.avatar,
      name: user.name,
      _id: user.id,
    }))
    .catch((err) => {
      // console.dir(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(500).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
    });
};

module.exports.updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  // обновим имя, найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send({
      about: user.about,
      avatar: user.avatar,
      name: user.name,
      _id: user.id,
    }))
    .catch((err) => {
      // console.dir(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(500).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
    });
};
