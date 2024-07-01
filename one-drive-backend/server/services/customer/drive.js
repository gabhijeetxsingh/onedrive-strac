// eslint-disable-next-line import/no-extraneous-dependencies
const { Client } = require('@microsoft/microsoft-graph-client');

const getClient = (accessToken) => Client.init({
  authProvider: (done) => {
    done(null, accessToken);
  },
});

const get = async (accessToken) => {
  const client = getClient(accessToken);

  try {
    const response = await client.api('/me/drive/root/children').get();

    return { doc: response };
  } catch (error) {
    return error;
  }
};

module.exports = {
  get,
};
