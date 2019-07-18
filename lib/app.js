const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/v1/studios', require('../lib/routes/studios'));
app.use('/api/v1/actors', require('../lib/routes/actors'));
app.use('/api/v1/reviewers', require('../lib/routes/reviewers'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
