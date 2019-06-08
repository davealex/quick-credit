const dotenv = require('dotenv');
const appRoot = require('app-root-path');

dotenv.config();
// export app configuration object
export default {
  APP_NAME: process.env.APP_NAME,
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  LOG_LEVEL: process.env.LOG_LEVEL,
  APP_ROOT: appRoot,
  JWT_KEY: process.env.JWT_KEY,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  TEST_DB_URL: process.env.TEST_DB_URL,
};
