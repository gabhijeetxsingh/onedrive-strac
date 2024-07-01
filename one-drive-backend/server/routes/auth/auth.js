const { login } = require('../../controllers/auth');

module.exports = (router) => {
  router.get('/login', login);
};
