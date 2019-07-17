const {Router} = require('express');
const Studio = require('../models/Studio');

module.exports = Router()
  .get('/', (req, res, next) => {
    const {name, address} = req.body;
    Studio
      .create({ name, address })
      .then(studio => res.send(studio))
      .catch(next)
  })