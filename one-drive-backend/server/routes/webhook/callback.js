const { callback } = require('../../controllers/webhook');

module.exports = (router) => {
  router.get('/callback', callback);
};
