const {Router} = require('express');
const Studio = require('../models/Studio');

module.exports = Router()
  .get('/', (req, res, next) => {
    Studio
      .find()
      .then(studios => res.send(studios))
      .catch(next)
  })
  .post('/', (req, res, next) => {
    const { name, address: {city, state, country}} = req.body;
    Studio
      .create({ name, address: {city, state, country}})
      .then(studio => res.send(studio))
  })