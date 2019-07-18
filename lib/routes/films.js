const { Router } = require('express');
const Film = require('../models/Film');

module.exports = Router()
  .get('/', (req, res, next) => {
    Film
      .find()
      .select({ _id: true, title: true, released: true, studio: true })
      .then(films => res.send(films))
      .catch(next);
  })
;