const express = require('express');

const cors = require('cors');

const swaggerUi = require('swagger-ui-express');

const { PORT } = require('../config/app');

const router = require('../routes/api');

const specs = require('../config/swagger');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', router);

app.listen(PORT || 3000);

module.exports = app;
