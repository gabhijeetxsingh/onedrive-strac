module.exports = (config) => (req, res, next) => {
  const { sendStatusCodeinRespose } = config || {};
  const { 'x-coreplatform-correlationid': correlationId } = req.headers;

  const responseStructure = (type, details, statusCode) => {
    const isValid = details.some((obj) => {
      if (obj.name && obj.message) {
        return true;
      }

      return false;
    });

    if (isValid) {
      if (sendStatusCodeinRespose) {
        return {
          statusCode,
          type,
          details,
        };
      }

      return {
        type,
        details,
      };
    }

    // eslint-disable-next-line no-console
    console.log({
      level: 'error',
      meta: {
        message: 'unexpected-internal-server-error',
        details: '4.x.x response body structure should follow the standards defined by eazyfin core team',
      },
    });

    if (sendStatusCodeinRespose) {
      return {
        statusCode: 500,
        type: 'unexpected-internal-server-error',
        correlationId,
        details: [
          {
            name: 'unexpected-server-error',
            message: 'Please contact administrator and present correlation identifier for troubleshooting',
          },
        ],
      };
    }

    return {
      type: 'unexpected-internal-server-error',
      correlationId,
      details: [
        {
          name: 'unexpected-server-error',
          message: '4.x.x response body structure should follow the standards defined by eazyfin core team',
        },
      ],
    };
  };

  const successResponseStructure = (json, statusCode) => {
    if (json) {
      const { data, doc, message } = json;

      if (sendStatusCodeinRespose) {
        return {
          data: data || doc,
          message,
        };
      }

      return {
        statusCode,
        data: data || doc,
        message,
      };
    }

    return { statusCode };
  };

  const unAuthorized = () => res.status(401).json();

  const forbidden = () => res.status(403).json();

  const notFound = () => res.status(404).json();

  const concurrencyError = () => res.status(412).json();

  const badRequest = (type, details) => {
    const result = responseStructure(type, details, 400);

    if (result.type === 'unexpected-internal-server-error') {
      return res.status(500).json(result);
    }

    return res.status(400).json(result);
  };

  const serverError = (error = '', message = null) => {
    const defaultMessage = [
      {
        name: 'unexpected-server-error',
        message: 'Please contact administrator and present correlation identifier for troubleshooting',
      },
    ];

    // eslint-disable-next-line no-console
    console.log({
      level: 'error',
      meta: {
        message: 'unexpected-internal-server-error',
        details: error ? error.toString() : null,
      },
    });

    const userMessage = message || defaultMessage;

    if (sendStatusCodeinRespose) {
      return res.status(500).json({
        statusCode: 500,
        correlationId,
        type: 'unexpected-internal-server-error',
        details: userMessage,
      });
    }

    return res.status(500).json({
      correlationId,
      type: 'unexpected-internal-server-error',
      details: userMessage,
    });
  };

  const postSuccessfully = (json) => res.status(201).json(successResponseStructure(json, 201));
  const getSuccessfully = (json) => res.status(200).json(successResponseStructure(json, 200));
  const getRequest = (json) => res.status(200).json(json);
  const postRequest = () => res.status(201).json();
  const updated = () => res.status(204).json();
  const patch = () => res.status(204).json();
  const deleted = () => res.status(204).json();

  const response = {
    unAuthorized,
    forbidden,
    notFound,
    concurrencyError,
    badRequest,
    serverError,
    postSuccessfully,
    getSuccessfully,
    getRequest,
    postRequest,
    updated,
    deleted,
    patch,
  };

  Object.assign(res, response);

  return next();
};
