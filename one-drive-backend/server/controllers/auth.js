const { Auth: AuthService } = require('../services/auth');

const login = async (req, res) => {
  try {
    const { code } = req.body;

    const { doc } = await AuthService.login(code);

    if (doc) {
      const { url } = doc;

      return res.getRequest(url);
    }

    return res.badRequest();
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports = {
  login,
};
