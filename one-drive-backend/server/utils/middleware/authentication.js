const { expressjwt: jwt } = require('express-jwt');
const jwksClient = require('jwks-rsa');

/**
 * define our authentication middleware
 * see https://github.com/auth0/node-jwks-rsa#caching
 * see https://github.com/auth0/node-jwks-rsa#rate-limiting
 * validate the audience & issuer from received token vs JWKS endpoint
 * originalUrl only contains the url endpoint like ('/ping'|'/healthcheck') not the full fledge url endpoint like- http://abc.com:80/ping
 */
const jwtVerify = ({
  IDENTITY_SERVICE_URL, JWKSURL, AUDIENCE, credentialsRequired = true,
}) => jwt({
  secret: jwksClient.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 2,
    jwksUri: JWKSURL || `${IDENTITY_SERVICE_URL}/.well-known/jwks`,
  }),
  audience: AUDIENCE || 'platform',
  algorithms: [ 'RS256' ],
  credentialsRequired: !!credentialsRequired,
});

const authPostCheck = (req, res, next, config) => async (error) => {
  // unauthorized or 401 exception thrown by jwt middleware
  if (error && error.name === 'UnauthorizedError') {
    return res.status(401).json(error);
  }
  const { credentialsRequired = true } = config;
  const { auth } = req;

  const isCredentailsRequired = !!credentialsRequired;

  if (isCredentailsRequired && !auth) {
    // eslint-disable-next-line no-console
    console.log({
      level: 'error',
      meta: {
        message: 'unexpected-internal-server-error',
        details: 'un-availability of IDS microservice.',
      },
    });

    return res.status(401).json();
  }

  return next();
};

const authPreCheck = (config, callback) => (req, res) => {
  const { IDENTITY_SERVICE_URL } = config;
  const { query } = req;

  if (query && query.access_token) {
    req.headers.authorization = `Bearer ${req.query.access_token}`;
  }
  // const { headers } = req;

  if (!IDENTITY_SERVICE_URL) {
    // eslint-disable-next-line no-console
    console.log({
      level: 'error',
      meta: {
        message: 'unexpected-internal-server-error',
        details: 'Exception raised:- Unable to get `IDENTITY_SERVICE_URL` from configuration',
      },
    });

    return res.status(500).json({
      type: 'unexpected-internal-server-error',
      correlationId: req['x-coreplatform-correlationid'],
      details: [
        {
          name: 'unexpected-server-error',
          messages: [ 'Please contact administrator and present correlation identifier for troubleshooting' ],
        },
      ],
    });
  }

  return callback();
};

const middleware = (config) => (req, res, next) => {
  const { ignorePaths } = config || { };
  const ignorePath = ignorePaths || [ '/ping', '/healthcheck' ];
  const { originalUrl } = req;

  if (!config) {
    // eslint-disable-next-line no-console
    console.log({
      level: 'error',
      meta: {
        message: 'unexpected-internal-server-error',
        details: '`config` is missing as middleware arguments. Please refer readme.md file for better clarity',
      },
    });

    return res.status(500).json({
      type: 'unexpected-internal-server-error',
      correlationId: req['x-coreplatform-correlationid'],
      details: [
        {
          name: 'unexpected-server-error',
          messages: [ 'Please contact administrator and present correlation identifier for troubleshooting' ],
        },
      ],
    });
  }

  const isIgnoredPath = ignorePath.some((element) => {
    const paths = element.split('/');
    const originalPaths = originalUrl.split('/');

    if (paths.length === originalPaths.length) {
      const isMatch = originalPaths.every((element1, index) => {
        const path = paths[index];
        const queryPath = element1.split('?')[0];

        if (path.charAt(0) === ':') {
          return true;
        }
        if (path === element1) {
          return true;
        }
        if (path === queryPath) {
          return true;
        }

        return false;
      });

      return isMatch;
    }

    return false;
  });

  if (isIgnoredPath) {
    return next();
  }

  return authPreCheck(config, () => {
    jwtVerify(config)(req, res, authPostCheck(req, res, next, config));
  })(req, res);
};

module.exports = middleware;
