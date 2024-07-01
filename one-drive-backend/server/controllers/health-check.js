const HealthCheck = require('../services/health-check');
const { VERSION, NAME } = require('../config');

const status = async (req, res) => {
  const response = await HealthCheck.status([ ]);

  return res.getRequest({
    dependsOn: response,
    version: `${VERSION}`,
    name: `${NAME}`,
  });
};

module.exports = { status };
