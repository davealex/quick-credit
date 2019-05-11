const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'Quick Credit API',
      version: '1.0.0',
      description: 'An online lending platform that provides short term soft loans to individuals',
    },
    schemes: {
      https: 'https',
      http: 'http',
    },
  },
  // List of files to be processed. You can also set globs '../routes/*.js'
  apis: ['./backend/routes/api.js'],

};

const specs = swaggerJsdoc(options);

module.exports = specs;
