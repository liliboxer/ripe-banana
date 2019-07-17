require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const Studio = require('../lib/models/Studio')

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

  it('GET all studios', async() => {
    const studios = await Studio.create([
      { name: 'Studio Ghibli', address: { city: 'Tokyo',state: 'Tokyo', country: 'Japan'}},
      { name: 'Wes Anderson', address: { city: 'Cool',state: 'Idk', country: 'USA'}},
      { name: 'Some Other Studio', address: { city: 'IDK',state: 'idc', country: 'wherever'}}
    ])
    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        const studiosJSON = JSON.parse(JSON.stringify(studios));
        studiosJSON.forEach(studio => {
          expect(res.body).toContainEqual(studio)
        })
      })
  })
  // it('POST studio', () => {
  //   .post('/api/v1/studios')
  // })
})