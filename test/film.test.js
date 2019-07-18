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
  let cast = null;

  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Max Studio', address: { city: 'Portland', state: 'Oregon', country: 'USA' } })));
    actors = await Actor.create([
      { name: 'lili', dob: '1992-03-07', pob: 'somewhere' },
      { name: 'dirt', dob: '1982-03-05', pob: 'really' },
      { name: 'alex', dob: '1992-03-07', pob: 'cool' }
    ]);
    const actorArr = actors.map(actor => {
      return JSON.parse(JSON.stringify(actor));
    });
    cast = actorArr.map((actor, i) => ({
      role: `extra ${i}`,
      actor: { _id: actor._id, name: actor.name }
    }));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('GET films, return id title released studio {id, name}', async() => {
    const film = await Film.create({ title: 'Princess Mononoke', released: 1990, studio });
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        const filmJSON = JSON.parse(JSON.stringify(film));
        delete filmJSON.cast;
        delete filmJSON.__v;
        expect(res.body).toContainEqual({ 
          title: film.title, 
          _id: film._id.toString(), 
          released: film.released, 
          studio: { _id: studio._id.toString(), name: studio.name }
        });
      });
  });

  it('POST film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({ title: 'Totoro', studio, released: 1993, cast: cast })
      .then(res => {
        expect(res.body).toEqual({ 
          _id: expect.any(String),
          __v: 0,
          title: 'Totoro',
          studio: studio._id.toString(),
          released: 1993,
          cast: cast.map(c => ({
            _id: expect.any(String),
            role: c.role,
            actor: c.actor._id
          }))
        });
      });
  });

  it('GET film by id', async() => {
    const film = await Film.create({ title: 'Harry Potter', studio, released: 1990, cast: cast });
    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body).toEqual({ 
          title: 'Harry Potter', 
          studio: { _id: studio._id, name: studio.name },
          released: 1990, 
          cast: cast.map(c => ({
            ...c,
            _id: expect.any(String)
          }))
        });
      });
  });

  it('DELETE film by id', async() => {
    const film = JSON.parse(JSON.stringify(await Film.create({ title: 'Harry Potter', studio, released: 1990, cast: cast })));

    return request(app)
      .delete(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body).toEqual(film);
      });
  });
});
