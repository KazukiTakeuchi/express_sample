const express = require('express')
const app = express();

// const logMiddleware = (req, res, next) => {
//   console.log(Date.now, req.method, req.url);
//   next();
// }

// app.use(logMiddleware);

app.get('/', (req, res) => {
  res.status(200).send('hello world')
})

app.get('/user/:id', (req, res) => {
  res.status(200).send(req.params.id)
})

app.get('/err', (req, res) => {
  throw new Error('同期エラー');
  console.log('errルーティング');
  res.status(200).send('errルート')
})

app.use((err, req, res, next) => {
  res.status(500).send('Internal Sever Error');
})

app.listen(3001, () => {
  console.log('start listening')
})
