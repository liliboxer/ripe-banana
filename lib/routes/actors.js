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
  .get('/:id', (req, res, next) => {
    Actor
      .findById(req.params.id)
      .select({ name: true, dob: true, pob: true })
      .then(actor => res.send(actor))
      .catch(next);
  })
  .post('/', (req, res, next) => {
    const { name, dob, pob } = req.body;
    Actor
      .create({ name, dob, pob })
      .then(actor => res.send(actor))
      .catch(next);
  })
  .put('/:id', (req, res, next) => {
    Actor
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .select({ __v: false })
      .then(actor => res.send(actor))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Actor
      .findByIdAndDelete(req.params.id)
      .then(actor => res.send(actor))
      .catch(next);
  })
  
