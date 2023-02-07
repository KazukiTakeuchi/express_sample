const Redis = require('ioredis');
const express = require('express');
const app = express();

const redis = new Redis({
  port: 6379,
  host: 'localhost',
  password: process.env.REDIS_PASSWORD,
  enableOfflineQuece: false
});

const init = async () => {
  await Promise.all([
    redis.set('users:1', JSON.stringify({
      id: 1,
      name: 'take'
    })),
    redis.set('users:2', JSON.stringify({
      id: 1,
      name: 'kazu'
    })),
    redis.set('users:3', JSON.stringify({
      id: 1,
      name: 'yoshikawa'
    })),
  ])
}

app.get('/', (req, res) => {
  res.status(200).send('hello');
});

app.get('/user/:id', (req, res) => {
  res.status(200).send(req.params.id);
});

redis.once('ready', async () => {
  try {
    await init();
    app.listen(3001, () => {
      console.log('start listening');
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
});

redis.on('error', (err) => {
  console.log(err);
  process.exit(1);
});
