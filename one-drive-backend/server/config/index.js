const { version, name } = require('../package.json');

module.exports = {
  VERSION: process.env.VERSION || version,
  NAME: process.env.NAME || name,
  DOMAIN: process.env.DOMAIN || 'http://localhost:3000',
  HOST: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || 3001,
  REDIS_SERVER: process.env.REDIS_SERVER || '127.0.0.1',
  IDENTITY_SERVICE_URL: process.env.IDENTITY_SERVICE_URL || 'http://api',

  AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID,
  AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_REGION: process.env.AWS_S3_REGION || 'af-south-1',
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || 'devcartal-dev',

  REDIRECT_URI: process.env.REDIRECT_URI || 'http://localhost:3000/callback',
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET
};
