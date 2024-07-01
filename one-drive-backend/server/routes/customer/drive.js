const { get } = require('../../controllers/customer/drive');

module.exports = (router) => {
  router.get('/get/files', get);
};
