const { Router } = require('express');
const Reviewer = require('../models/Reviewer');

module.exports = Router()
  .get('/', (req, res, next) => {
    Reviewer
      .find()
      .then(reviewers => res.send(reviewers))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Reviewer
      .findById(req.params.id)
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })
  .post('/:id', (req, res, next) => {
    Reviewer
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })
  .put('/:id', (req, res, next) => {
    Reviewer
      .findByIdAndUpdate(req.params.id, { name: 'alex' }, { new: true })
      .then(reviewer => res.send(reviewer))
      .catch(next)
  });
