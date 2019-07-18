const { Router } = require('express');
const Film = require('../models/Film');

module.exports = Router()
  .get('/', (req, res, next) => {
    Film
      .find()
      .populate('studio', { _id: true, name: true })
      .select({ __v: false, cast: false })
      .then(films => res.send(films))
      .catch(next);
  })
  .post('/', (req, res, next) => {
    const { title, studio, released, cast } = req.body;
    Film
      .create({ title, studio, released, cast })
      .then(film => res.send(film))
      .catch(next);
  })
;
