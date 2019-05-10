const dotenv = require('dotenv');
const appRoot = require('app-root-path');

dotenv.config();
// export app configuration object
module.exports = {
  APP_NAME: process.env.APP_NAME,
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  LOG_LEVEL: process.env.LOG_LEVEL,
  APP_ROOT: appRoot,
  JWT_KEY: process.env.JWT_KEY || 'yuyuuy65!@3$5^uuih(0*7t',
};
