const express = require('express');

const cors = require('cors');

const { PORT } = require('../config/app');

const router = require('../routes/api');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

app.listen(PORT || 3000);

module.exports = app;
