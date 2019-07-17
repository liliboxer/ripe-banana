const {Router} = require('express');
const Studio = require('../models/Studio');

module.exports = Router()
  .get('/', (req, res, next) => {
    Studio
      .find()
      .then(studios => res.send(studios))
      .catch(next)
  })
  // .get('/', (req, res, next) => {
  //   const {name, { city, country}} = req.body;
  //   Studio
  //     .create({ name, address })
  //     .then(studio => res.send(studio))
  //     .catch(next)
  // })