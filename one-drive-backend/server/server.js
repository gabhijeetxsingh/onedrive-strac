const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');
const moment = require('moment');

const correlationId = require('correlationid-middleware');

const SmartHttp = require('./utils/middleware/http');

const { PORT } = require('./config');

const {
  EXPOSED_HEADERS,
} = require('./utils/constant');

const app = express();

/**
 * Start the app by listening <port>
 * */
const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on PORT ${PORT}`);
});

const defaultRoutes = require('./routes');
const webhookRoutes = require('./routes/webhook');

/**
 * List of all middlewares used in project cors, compression, helmet
 * */
try {
  // set the limit of file size max :10mb (20971520)
  const upload = multer({
    limits: {
      fileSize: 35971520,
    },
  });

  app.use(upload.array('file', 2));

  app.locals.moment = moment;

  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    const { message = 'Please upload the file lesser than 100MB' } = err;

    return res.status(400).send({
      type: 'field-validation',
      details: [ { message, name: 'file' } ],
    });
  });

  app.enable('trust proxy', 1);
  app.get('/ip', (request, response) => response.send(request.ip));
  app.use(correlationId, SmartHttp());
  app.use(cors({
    exposedHeaders: EXPOSED_HEADERS,
  }));
  app.use(compression());
  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/v1/webhook', webhookRoutes);

  app.use('/', defaultRoutes);

  app.use(express.static(path.join(__dirname, 'view/public')));

  app.set('views', path.join(__dirname, 'view'));
  app.set('view engine', 'pug');

  app.all('/*', (_req, res) => res.notFound());

  // Event 'uncaughtException'
  process.on('uncaughtException', (error, source) => {
    // eslint-disable-next-line no-console
    console.log(process.stderr.fd, error, source);
  });
} catch (e) {
  // eslint-disable-next-line no-console
  console.log(e);
  server.close();
}

module.exports = server;
