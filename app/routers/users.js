const usersValidators = require('../middleware/validators/users');
const validators = require('../middleware/validators/validators');
const commonValidators = require('../middleware/validators/common-validators');
const usersController = require('../controllers/users');
const transformerUser = require('../middleware/transformer/users');

module.exports = function (app, jsonParser) {
  app.post(
    '/register',
    jsonParser,
    validators.registerValidators,
    transformerUser.passwordToHex,
    (req, res) => {
      usersController.register(req, res);
    }
  );

  app.post(
    '/register-identity',
    jsonParser,
    validators.registerIdentityValidators,
    (req, res) => {
      usersController.registerIdentity(req, res);
    }
  );

  app.put(
    '/email-verification',
    jsonParser,
    usersValidators.putEmailVerification(),
    (req, res) => {
      usersController.sendEmailVerification(req, res);
    }
  );

  app.post(
    '/email-verification',
    jsonParser,
    usersValidators.verificationCode(),
    usersValidators.email(),
    (req, res) => {
      usersController.confirmEmailVerification(req, res);
    }
  );

  app.post('/login', jsonParser, validators.loginValidators, (req, res) => {
    usersController.login(req, res);
  });
};
