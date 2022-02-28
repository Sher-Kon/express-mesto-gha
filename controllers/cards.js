// controllers/cards.js
// это файл контроллеров

const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  console.log("owner: "+req.user._id); // _id станет доступен
  const owner = req.user._id;
  const { name, link } = req.body;
  const likes = [];
  const createdAt = "";//Date.now;

  Card.create({ name, link, owner, likes, createdAt })
    .then(card => res.send({ name: card.name }))
    //.catch((err) => {console.log(err)});
    .catch((err) => { console.dir(err); res.status(500).send({ message: 'Произошла ошибка createCard' }) });
};

module.exports.getCards = (req, res) => {
  Card.find({}) //запрос всех
    .then(cards => res.send({ cards: cards }))//
    .catch(() => res.status(500).send({ message: 'Произошла ошибка getCards' }));
};
