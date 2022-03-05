const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerCards = require('./routes/cards'); // импортируем роутер
const routerUsers = require('./routes/users'); // импортируем роутер

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');//

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use((req, res, next) => {
  req.user = {
    _id: '621c5f720253f81c16cb74d6', // _id пользователя
  };
  next();
});

app.use('/', routerUsers); // запускаем
app.use('/', routerCards); // запускаем
app.use((req, res) => {
  res.status(404).send({ message: 'Запрос на несуществующий роут' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
