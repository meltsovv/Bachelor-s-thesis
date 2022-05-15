const transactionController = require('../controllers/transaction');
const commonValidators = require('../middleware/validators/common-validators');
const validators = require('../middleware/validators/validators');

module.exports = function (app, jsonParser) {
  app.get('/transaction/usdt', commonValidators.limit(), (req, res) => {
    transactionController.getUsdtTransactions(req, res);
  });

  app.post(
    '/create-payment-link',
    jsonParser,
    validators.createPaymentLink,
    (req, res) => {
      transactionController.createPaymentLink(req, res);
    }
  );

  app.post('/transaction/currency', jsonParser, (req, res) => {
    transactionController.createCreditTransaction(req, res);
  });

  app.get('/transaction/currency', commonValidators.limit(), (req, res) => {
    transactionController.getCreditTransaction(req, res);
  });

  app.get('/total', (req, res) => {
    transactionController.getTotalInfo(req, res);
  });
};
