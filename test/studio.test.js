require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const Studio = require('../lib/models/Studio');

describe('studio routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('GET all studios and return ID and name', async() => {
    const studios = await Studio.create([
      { name: 'Studio Ghibli', address: { city: 'Tokyo', state: 'Tokyo', country: 'Japan' } },
      { name: 'Wes Anderson', address: { city: 'Cool', state: 'Idk', country: 'USA' } },
      { name: 'Some Other Studio', address: { city: 'IDK', state: 'idc', country: 'wherever' } }
    ]);
    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        const studiosJSON = JSON.parse(JSON.stringify(studios));
        studiosJSON.forEach(studio => {
          expect(res.body).toContainEqual({ name: studio.name, _id: studio._id });
        });
      });
  });

  it('POST studio', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({ name: 'Studio Ghibli', address: { city: 'Tokyo', state: 'Tokyo', country: 'Japan' } })
      .then(res => {
        expect(res.body).toEqual({  __v: 0, _id: expect.any(String), name: 'Studio Ghibli', address: { city: 'Tokyo', state: 'Tokyo', country: 'Japan' } });
      });
  });

  it('GET studio by id', async() => {
    const studio = await Studio.create({ name: 'Wes Anderson', address: { city: 'Cool', state: 'Idk', country: 'USA' } });
    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({ _id: expect.any(String), name: 'Wes Anderson', address: { city: 'Cool', state: 'Idk', country: 'USA' } });
      });
  });

  it('delete studio by ID', async() => {
    const studio = await Studio.create({ name: 'Wes Anderson', address: { city: 'Cool', state: 'Idk', country: 'USA' } });
    return request(app)
      .delete(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({  __v: 0, _id: expect.any(String), name: 'Wes Anderson', address: { city: 'Cool', state: 'Idk', country: 'USA' } });
      });
  });
});
