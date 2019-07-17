require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

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

  it('get all studios', () => {
    return request(app)
      .get('/api/v1/studios')
      .send({
        name: 'Studio Ghibli',
        address: {
          city: 'Tokyo',
          state: 'Tokyo',
          country: 'Japan'
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          name: 'Studio Ghibli',
          address: {
            city: 'Tokyo',
            state: 'Tokyo',
            country: 'Japan'
          }
        })
      })
  })
})