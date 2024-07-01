const express = require('express');

const router = express.Router();

const pingRoutes = require('./ping');
const healthCheckRoutes = require('./health-check');
const authRoutes = require('./auth/auth');
const webhookRoutes = require('./webhook/callback');
const driveRoutes = require('./customer/drive');

pingRoutes(router);
healthCheckRoutes(router);
authRoutes(router);
webhookRoutes(router);
driveRoutes(router);

module.exports = router;
