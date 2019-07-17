const { Router } = require('express');
const Actor = require('../models/Actor');

module.exports = Router()
  .get('/', (req, res, next) => {
    Actor
      .find()
      .select({ name: true, _id: true })
      .then(actors => res.send(actors))
      .catch(next);
  })
;