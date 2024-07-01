const gcm = require('node-gcm');

const { FCM_SERVER_KEY } = require('../config');

const sender = new gcm.Sender(FCM_SERVER_KEY);

const send = async (token, data) => {
  const notification = {
    priority: 'high', mutableContent: true, contentAvailable: true, data,
  };

  const GCM = new gcm.Message(notification);

  await new Promise((resolve) => {
    sender.send(GCM, { registrationTokens: token }, async (err, res) => {
      if (err) {
        return resolve({ errors: [ { name: 'notification', message: 'Notification sent failed.' } ] });
      }

      const { results, success } = res;

      const failedTokens = token.filter((_, i) => {
        const { error } = results[i];

        return error != null;
      });

      return resolve({ doc: { message: `${success} notification sent.`, failedTokens } });
    });
  });

  return { doc: { message: 'successfully sent.' } };
};

module.exports = { send };
