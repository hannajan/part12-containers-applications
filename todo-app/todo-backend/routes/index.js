const express = require('express');
const redis = require('../redis')
const router = express.Router();
const { Todo } = require('../mongo')
const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (req, res) => {
  const todoCount = await redis.getAsync('todos') || 0
  const data = {
    added_todos: Number(todoCount),
  }

  res.send(data)
})

module.exports = router;
