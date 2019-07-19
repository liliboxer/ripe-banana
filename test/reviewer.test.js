require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');


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
    const studio = await Studio.create({ name: 'Wes Anderson', address: { city: 'Cool', state: 'Idk', country: 'USA' } });
    const actor = await Actor.create({ name: 'lili', dob: '1992-03-07T00:00:00.000Z', pob: 'somewhere' });
    const reviewer = await Reviewer.create({ name: 'harry', company: 'harry potter 3' });
    const film = await Film.create({ title: 'Princess Mononoke', released: 1990, studio, cast: [{ role: 'kitty', actor: actor._id }] });
    const review = await Review.create({ rating: 8, reviewer: reviewer._id.toString(), review: 'this is difficult', film: film._id.toString() });

    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'harry', 
          company: 'harry potter 3',
          reviews: [{
            _id: review._id.toString(),
            rating: review.rating,
            review: review.review,
            film: { _id: film._id.toString(), title: film.title }
          }]
        });
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
