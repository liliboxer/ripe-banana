require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');


const Review = require('../lib/models/Review');
const Film = require('../lib/models/Film');
const Reviewer = require('../lib/models/Reviewer');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

describe('review routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio = null;
  let film = null;
  let actor = null;
  let reviewer = null;

  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Max Studio', address: { city: 'Portland', state: 'Oregon', country: 'USA' } })));
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'lili', dob: '1992-03-07', pob: 'somewhere' })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Princess Mononoke', released: 1990, studio: studio._id, cast: { role: 'ugh', actor: actor._id } })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'max', company: 'talks too loud' })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('GET reviews, 100 most recent, film {_id, title} ', async() => {
    await Promise.all([...Array(101)].map((i) => {
      return Review.create({
        rating: 8,
        reviewer: reviewer._id,
        review: `this is review #${i}`,
        film: film._id
      });
    }));

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body).toHaveLength(100);
      });
  });

  it('POST review', () => {
    return request(app)
      .post('/api/v1/reviews')
      .send({ rating: 8, reviewer: reviewer._id, review: 'this is review', film: film._id })
      .then(res => {
        expect(res.body).toEqual({ _id: expect.any(String), __v: 0, rating: 8, reviewer: reviewer._id, review: 'this is review', film: film._id, createdAt: expect.any(String), updatedAt: expect.any(String) });
      });
  });
});
