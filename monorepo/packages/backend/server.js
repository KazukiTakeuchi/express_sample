const path = require('path');
const express = require('express');
const redis = require('./lib/redis');
const usersHandler = require('./handlers/users');

const app = express();

app.get('/user/:id', async (req, res) => {
  try {
    const user = await usersHandler.getUser(req);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('internal error');
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const users = await usersHandler.getUsers(req);
    res.status(200).json(users)
  } catch (err) {
    console.log(err);
    res.status(500).send('internal error')
  }
})

redis.connect()
  .once('ready', async () => {
    try {
      await redis.init();
      app.listen(3001, () => {
        console.log('start');
      })
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  })
  .on('error', (err) => {
    console.error(err);
    process.exit(1);
  })
