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
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'max', company: 'talks too loud'}));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('GET reviews, 100 most recent, film {_id, title} ', () => {

  });
});
