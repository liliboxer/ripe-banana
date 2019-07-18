require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const Reviewer = require('../lib/models/Reviewer');

describe('reviewer routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('GET all reviwers', async() => {
    const reviewers = await Reviewer.create([
      { name: 'harry', company: 'harry potter 3' },
      { name: 'hermione', company: 'harry potter 1' },
      { name: 'ron', company: 'harry potter 4' }
    ]);
    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        const reviewersJSON = JSON.parse(JSON.stringify(reviewers));
        reviewersJSON.forEach(reviewer => {
          expect(res.body).toContainEqual(reviewer);
        });
      });
  });

  it('GET reviewer by ID', async() => {
    const reviewer = await Reviewer.create({ name: 'harry', company: 'harry potter 3' });
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        const reviewerJSON = JSON.parse(JSON.stringify(reviewer));
        expect(res.body).toEqual(reviewerJSON);
      });
  });

  it('POST reviewer', async() => {
    const reviewer = await Reviewer.create({ name: 'harry', company: 'harry potter 3' });
    return request(app)
      .post(`/api/v1/reviewers/${reviewer._id}`)
      .send({ name: 'lili', company: 'i am tired' })
      .then(res => {
        expect(res.body).toEqual({ _id: expect.any(String), __v: 0, name: 'lili', company: 'i am tired' });
      });
  });
  
  it('PUT reviewer', async() => {
    const reviewer = await Reviewer.create({ name: 'harry', company: 'harry potter 3' });
    return request(app)
      .put(`/api/v1/reviewers/${reviewer._id}`)
      .send({ name: 'alex' })
      .then(res => {
        expect(res.body).toEqual({ _id: expect.any(String), __v: 0, name: 'alex', company: 'harry potter 3' });
      });
  });

});
