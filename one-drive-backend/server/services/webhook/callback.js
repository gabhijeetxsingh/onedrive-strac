const { REDIRECT_URI, CLIENT_ID, CLIENT_SECRET } = require('../../config');
const Helper = require('../../utils/helper');

const callback = async ({ code }) => {
  const jsonObject = {
    client_id: CLIENT_ID,
    scope: 'Files.ReadWrite Files.Read',
    code,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
    client_secret: CLIENT_SECRET,
  };

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const { data } = await Helper.postRequest({
      url: 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token',
      headers,
      data: new URLSearchParams(jsonObject).toString(),
    });

    if (data) {
      return { doc: { token: data.access_token } };
    }

    return { errors: [ { name: 'token', message: 'not found' } ] };
  } catch (errors) {
    return { errors };
  }
};

module.exports = {
  callback,
};
