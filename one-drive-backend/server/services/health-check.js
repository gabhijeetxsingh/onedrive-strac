const axios = require('axios');

const checkMicroServiceStatus = async (url) => {
  try {
    const { data: { version, name } } = await axios(`${url}/ping`);

    return ({
      url,
      name,
      status: 'success',
      type: 'service',
      version: version || null,
    });
  } catch (error) {
    return ({
      url,
      name: url,
      status: 'failure',
      type: 'service',
    });
  }
};

const getDatabaseDetails = async () => {
  const version = null;

  try {
    return ({
      status: 'success',
      type: 'database',
      version,
    });
  } catch (error) {
    return ({
      status: 'failure',
      type: 'database',
      version,
    });
  }
};

const status = async (urls = []) => {
  const response = await Promise.all(urls.map(async (url) => {
    const result = await checkMicroServiceStatus(`${url}`);

    return result;
  }));

  const checkDbConnection = await getDatabaseDetails();

  response.push(checkDbConnection);

  return response;
};

module.exports = { status, getDatabaseDetails, checkMicroServiceStatus };
