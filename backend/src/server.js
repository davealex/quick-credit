const express = require('express');

const cors = require('cors');

const swaggerUi = require('swagger-ui-express');

const { PORT } = require('../config/app');

const routerV1 = require('../routes/api/v1/api');

const specs = require('../config/swagger');

const app = express();

const Index = require('../controllers/indexController');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/v1', routerV1);

// respond to GET '/'
app.use((req, res, next) => {
  if (req.originalUrl === '/') Index.getIndex(req, res);
  next();
});

app.use((req, res) => {
  res.status(404);

  // respond with json
  if (req.accepts('json')) res.send({ status: 404, error: 'Invalid route/URL' });
});

app.listen(PORT || 3000);

module.exports = app;
