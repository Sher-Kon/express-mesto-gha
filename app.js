const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routerCards = require('./routes/cards'); // импортируем роутер
const routerUsers = require('./routes/users'); // импортируем роутер

const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.post('/signin', login);
app.post('/signup', createUser);
// авторизация
app.use(auth);

app.use('/', routerUsers); // запускаем
app.use('/', routerCards); // запускаем
app.use((req, res, next) => {
  // ошибку отправим на централизованную обработку
  const err = new Error('Запрос на несуществующий rout');
  err.statusCode = 404;
  next(err);
});

// централизованно обрабатываем все ошибки
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
