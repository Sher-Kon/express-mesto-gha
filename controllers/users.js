// controllers/users.js
// это файл контроллеров
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));//Неправильные почта
      }
      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));//хеши не совпали у пароля
      }
      // аутентификация успешна
      // res.send({ message: 'Всё верно!' });
      // создадим токен
      // id из задания              'd285e3dceed844f902650f40'
      const token = jwt.sign({ _id: '6228961fe85fd137eef2be33' }, 'some-secret-key', {expiresIn: '7d'});
      res.send({ token });// вернём токен
    })
    .catch((err) => {
      // возвращаем ошибку аутентификации
      if (err.name === 'MongoError' && err.code === 11000) {
        res
          .status(409)
          .send({ message: 'такой email уже зарегистрирован' });
      } else {
        res
          .status(401)
          .send({ message: err.message });
      }
    });
};

module.exports.getUserID = (req, res) => {
  User.findById(req.params.id)// запрос одного
    .then((users) => {
      if (!users) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
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
  // const { name, about, avatar, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    })
      .then((user) => res.send({
        about: user.about,
        avatar: user.avatar,
        name: user.name,
        _id: user.id,
      })))
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
