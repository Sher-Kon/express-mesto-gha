// controllers/cards.js
// это файл контроллеров

const Card = require('../models/card');

module.exports.createCard = (req, res, next) => {
  // console.log(`owner: ${req.user._id}`); // _id станет доступен
  const owner = req.user._id;
  const { name, link } = req.body;
  const likes = [];

  Card.create({
    name, link, owner, likes,
  })
    .then((card) => res.send({
      createdAt: card.createdAt,
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: card.owner,
      _id: card.id,
    }))
    .catch((err) => {
      // console.dir(err);
      if (err.name === 'ValidationError') {
        // res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
        err = new Error('Переданы некорректные данные при создании карточки');
        err.statusCode = 400;
        next(err);
      } else {
        // res.status(500).send({ message: 'Переданы некорректные данные при создании карточки' });
        err = new Error('Переданы некорректные данные при создании карточки');
        err.statusCode = 500;
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({}) // запрос всех
    .then((cards) => res.send({ cards }))//
    .catch(() => {
      // console.dir(err);
      // res.status(500).send({ message: 'Запрашиваемые карточки не найдены' });
      const err = new Error('Запрашиваемые карточки не найдены');
      err.statusCode = 500;
      next(err);
  });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => { //
      if (!card) {
        // res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        const err = new Error('Карточка с указанным _id не найдена');
        err.statusCode = 404;
        next(err);
      }
      if (JSON.stringify(card.owner) === `"${req.user._id}"`) {
        // res.send({ message: 'Своя карточка' });
        Card.findByIdAndRemove(req.params.id)
          .then(() => { //
            res.send({ message: 'Пост удален' });
          });
      } else {
        // res.status(403).send({ message: 'Нельзя удалять чужую карточку' });
        const err = new Error('Нельзя удалять чужую карточку');
        err.statusCode = 403;
        next(err);
      }
    })
    .catch((err) => { //
      // console.dir(err);
      if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Невалидный id ' });
        const err = new Error('Невалидный id');
        err.statusCode = 400;
        next(err);
      } else {
        // res.status(500).send({ message: 'Карточка с указанным _id не найдена' });
        const err = new Error('Карточка с указанным _id не найдена');
        err.statusCode = 500;
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        //res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        const err = new Error('Карточка с указанным _id не найдена');
        err.statusCode = 404;
        next(err);
      } else {
        res.send({
          createdAt: card.createdAt,
          likes: card.likes,
          link: card.link,
          name: card.name,
          owner: card.owner,
          _id: card.id,
        });
      }
    })
    .catch((err) => {
      // console.dir(err);
      if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Невалидный id' });
        const err = new Error('Невалидный id');
        err.statusCode = 400;
        next(err);
      } else {
        // res.status(500).send({ message: 'Переданы некорректные данные для постановки лайка' });
        const err = new Error('Переданы некорректные данные для постановки лайка');
        err.statusCode = 500;
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        // res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        const err = new Error('Карточка с указанным _id не найдена');
        err.statusCode = 404;
        next(err);
      } else {
        res.send({
          createdAt: card.createdAt,
          likes: card.likes,
          link: card.link,
          name: card.name,
          owner: card.owner,
          _id: card.id,
        });
      }
    })
    .catch((err) => {
      // console.dir(err);
      if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Невалидный id' });
        const err = new Error('Невалидный id');
        err.statusCode = 400;
        next(err);
      } else {
        // res.status(500).send({ message: 'Переданы некорректные данные для снятия лайка' });
        const err = new Error('Переданы некорректные данные для снятия лайка');
        err.statusCode = 500;
        next(err);
      }
    });
};
