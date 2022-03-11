// controllers/users.js
// это файл контроллеров
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-err'); // 400
const UnauthorizedError = require('../errors/unauthorized-err'); // 401
const NotFoundError = require('../errors/not-found-err'); // 404
const ConflictError = require('../errors/conflict-err'); // 409


module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта (или пароль)'));// Неправильные почта
      }
      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные (почта или) пароль'));// хеши не совпали у пароля
      }
      // аутентификация успешна
      // res.send({ message: 'Всё верно!' });
      // создадим токен из задания  'd285e3dceed844f902650f40'
      const token = jwt.sign({ _id: '622b6ff71cfe2693afb55dde' }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });// вернём токен
    })
    .catch((err) => {
      // возвращаем ошибку аутентификации
      // console.dir(err);
      if (err.name === 'MongoError' && err.code === 11000) {
        //  res.status(409).send({ message: 'такой email уже зарегистрирован' });
        next(new ConflictError('такой email уже зарегистрирован')); // 409
      } else {
        // res.status(401).send({ message: err.message });
        next(new UnauthorizedError(err.message)); // 401
      }
    });
};

module.exports.createUser = (req, res, next) => {
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
      if (err.code === 11000) { next(new ConflictError('такой пользователь уже зарегистрирован'));} // 409
      else { next(err); }
/*
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя')); // 400
      }
      else { next(err); }
      */
    });
};

module.exports.getUserID = (req, res, next) => {
  User.findById(req.params.id)// запрос одного
    .then((users) => {
      if (!users) {
        // res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        throw new NotFoundError('Пользователь с указанным _id не найден');// 404
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
        next(new BadRequestError('Невалидный id')); // 400
      }
      else { next(err); }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({}) // запрос всех
    .then((users) => res.send(users))//
    .catch(next);
};

module.exports.updateProfileUser = (req, res, next) => {
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
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля')); // 400
      }
      else { next(err); }
    });
};

module.exports.updateAvatarUser = (req, res, next) => {
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
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара')); // 400
      }
      else { next(err); }
    });
};
