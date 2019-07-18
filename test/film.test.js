require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

describe('film routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  
  let studio = null;
  let actors = null;

  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Max Studio', address: { city: 'Portland', state: 'Oregon', country: 'USA' } })));
    actors = await Actor.create([
      { name: 'lili', dob: '1992-03-07', pob: 'somewhere' },
      { name: 'dirt', dob: '1982-03-05', pob: 'really' },
      { name: 'alex', dob: '1992-03-07', pob: 'cool' }
    ]);
    actors.forEach(actor => {
      JSON.parse(JSON.stringify(actor));
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('GET films, return id title released studio{id, name}', async() => {
    const film = await Film.create({ title: 'Princess Mononoke', released: 1990, studio });
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        const filmJSON = JSON.parse(JSON.stringify(film));
        delete filmJSON.cast;
        delete filmJSON.__v;
        expect(res.body).toEqual([filmJSON]);
      });

  });
});
