const { Drive: DriveService } = require('../../services/customer');

const get = async (req, res) => {
  try {
    const accessToken = req.query.access_token;

    const { doc } = await DriveService.get(accessToken);

    if (doc) {
      return res.getRequest(doc);
    }

    return res.notFound();
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports = {
  get,
};
