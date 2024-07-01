const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const sinon = require('sinon');
const correlationId = require('correlationid-middleware');
const SmartHttp = require('../utils/middleware/http');
const authentication = require('../utils/middleware/authentication');

const Auth = { authentication };

const { USER_ID } = require('./constant');
const { EXPOSED_HEADERS } = require('../utils/constant');

const routes = require('../routes');

const { IDENTITY_SERVICE_URL } = require('../config');

const app = express();

/**
 * Start the server by listening <port>
 * */

app.enable('trust proxy');
app.use(correlationId, SmartHttp());

app.use(cors({
  exposedHeaders: EXPOSED_HEADERS,
}));

app.use(compression());
app.use(helmet());
app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());

const authObj = sinon.stub().callsFake((req, res, next) => {
  req.auth = { userId: USER_ID };

  if (req.originalUrl === '/ping' || req.originalUrl === '/healthcheck') {
    return next();
  }

  if ('authorization' in req.headers) {
    return next();
  }

  return res.status(401).json();
});

sinon.stub(Auth, 'authentication').callsFake(() => authObj);

app.use(Auth.authentication({
  IDENTITY_SERVICE_URL,
  AUDIENCE: 'platform',
  ignorePaths: [ '/ping', '/healthcheck' ],
}));

app.use('/', routes);

module.exports = app;
