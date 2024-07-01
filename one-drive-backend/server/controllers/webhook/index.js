const { Callback: CallbackService } = require('../../services/webhook');

const callback = async (req, res) => {
  try {
    const { doc } = await CallbackService.callback(req.query);

    if (doc) {
      const { token } = doc;

      return res.getRequest({ accessToken: token });
    }

    return res.notFound();
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports = {
  callback,
};
