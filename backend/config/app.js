const dotenv = require('dotenv');
const appRoot = require('app-root-path');

dotenv.config();
// export app configuration object
module.exports = {
  APP_NAME: process.env.APP_NAME,
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  LOG_LEVEL: process.env.LOG_LEVEL,
  APP_ROOT: appRoot,
};
