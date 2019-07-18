require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const Actor = require('../lib/models/Actor');

describe('actor routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('GET all actors', async() => {
    const actors = await Actor.create([
      { name: 'lili', dob: '1992-03-07', pob: 'somewhere' },
      { name: 'dirt', dob: '1982-03-05', pob: 'really' },
      { name: 'alex', dob: '1992-03-07', pob: 'cool' }
    ]);
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        const actorsJSON = JSON.parse(JSON.stringify(actors));
        actorsJSON.forEach(actor => {
          expect(res.body).toContainEqual({ name: actor.name, _id: actor._id });
        });
      });
  });

  it('GET actor by Id', async() => {
    const actor = await Actor.create({ name: 'lili', dob: '1992-03-07', pob: 'somewhere' });
    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({ _id: expect.any(String), name: 'lili', dob: expect.any(String), pob: 'somewhere' });
      });
  });

  it('POST actor', async() => {
    return request(app)
      .post('/api/v1/actors')
      .send({ name: 'lili', dob: '1992-03-07', pob: 'somewhere' })
      .then(res => {
        expect(res.body).toEqual({ _id: expect.any(String), __v: 0, name: 'lili', dob: '1992-03-07T00:00:00.000Z', pob: 'somewhere' });
      });
  });

  it('PUT actor', async() => {
    const actor = await Actor.create({ name: 'lili', dob: '1992-03-07', pob: 'somewhere' });
    return request(app)
      .put(`/api/v1/actors/${actor._id}`)
      .send({ name: 'dirt', dob: '1982-05-14', pob: 'somewhere' })
      .then(res => {
        expect(res.body).toEqual({ _id: expect.any(String), name: 'dirt', dob: '1982-05-14T00:00:00.000Z', pob: 'somewhere' });
      });
  });

  it('delete actor by id', async() => {
    const actor = await Actor.create({ name: 'lili', dob: '1992-03-07', pob: 'somewhere' });
    return request(app)
      .delete(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({  __v: 0, _id: expect.any(String), name: 'lili', dob: '1992-03-07T00:00:00.000Z', pob: 'somewhere' });
      });
  })
});
