const cryptoService = require('../../services/encryption.service');

exports.passwordToHex = (req, res, next) => {
  req.body.password = cryptoService.bcryptCreatePass(req.body.password);
  next();
};
