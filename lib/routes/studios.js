const { Router } = require('express');
const Studio = require('../models/Studio');

module.exports = Router()
  .get('/', (req, res, next) => {
    Studio
      .find()
      .select({ _id: true, name: true })
      .then(studios => res.send(studios))
      .catch(next);
  })
  .post('/', (req, res, next) => {
    const { name, address } = req.body;
    Studio
      .create({ name, address })
      .then(studio => res.send(studio))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Studio
      .findStudioById(req.params.id)
      .then(studioWithFilms => res.send(studioWithFilms))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Studio
      .findStudioById(req.params.id)
      .then(studio => {
        if(studio.films.length === 0) {
          Studio
            .findByIdAndDelete(req.params.id)
            .then(studio => res.send(studio));
        } else {
          const err = new Error('cannot delete because there are films');
          err.status = 409;
          next(err);
        }
      })
      .catch(next);
  });
