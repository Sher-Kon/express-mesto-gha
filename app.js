const http = require('http');

const { PORT = 3000, BASE_PATH } = process.env;

const mainPageMarkup = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="style.css">
    <title>Список дел</title>
    <style>
      html, body {
        font-family: Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        height: 100%;
        width: 100%;
        display: flex;
        margin: 0;
      }

      input, button {
        border: none;
      }

      .container {
        width: 468px;
        margin: 0 auto;
        padding-top: 100px;
      }

      h1 {
        font-weight: bold;
      }

      .input {
        display: flex;
        justify-content: space-between;
      }

      .input__text {
        font-size: 0.8em;
        width: 310px;
        height: 50px;
        border-bottom: 1px solid #f1f1f1;
        padding: 0 10px;
        box-sizing: border-box;
      }

      .input__elem_text::placeholder {
        color: #d3d3d3;
      }

      .input__btn {
        font-size: 0.8em;
        width: 150px;
        height: 50px;
        background-color: #ffdb4d;
        border-radius: 2px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <form class="container" action="${BASE_PATH}/submit" method="POST" enctype="text/plain" >
      <h1>Список дел</h1>
      <div class="input">
        <input type="text" placeholder="Дело" class="input__text" name="item">
        <button class="input__btn input__btn_add">
          Добавить
        </button>
      </div>
    </form>
  </body>
  </html>
`;

const submitSuccessMarkup = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="style.css">
        <title>Список дел</title>
        <style>
            html, body {
                font-family: Helvetica, Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
                height: 100%;
                width: 100%;
                display: flex;
                margin: 0;
            }

            .container {
                width: 468px;
                margin: 0 auto;
                padding-top: 100px;
            }

            h1 {
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Форма успешно отправлена</h1>
            <a href="${BASE_PATH}">Вернуться назад</a>
        </div>
    </body>
    </html>
`;
//пустой массив
const todos=[];

// создаём сервер
const server = http.createServer((req, res) => {

  if (req.url === '/submit' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      //console.log(body); // например, здесь
      // выделим всё, что идёт после знака равно, и добавим это в массив todos
      todos.push(body.split('=')[1]);
      console.log(todos);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(submitSuccessMarkup)
    });
  }
  if (req.url === '/' && req.method === 'GET'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(mainPageMarkup)
  }
});

server.listen(PORT); // будем принимать сообщения с 3000 порта