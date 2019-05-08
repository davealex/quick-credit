const express = require('express');

const cors = require('cors');

const { PORT, APP_ROOT } = require('../config/app');

const app = express();

app.use(cors());

app.use(express.static(`${APP_ROOT}/UI`));

app.listen(PORT || 3000);
