const { REDIRECT_URI, CLIENT_ID } = require('../../config');

const login = async () => {
  const query = {
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    response_mode: 'query',
    scope: 'Files.ReadWrite Files.Read',
    state: 12345,
  };

  const queryParams = new URLSearchParams(query).toString();

  return { doc: { url: `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?${queryParams}` } };
};

module.exports = {
  login,
};
