const transaction = require('./transaction');
const report = require('./report');
const img = require('./img');
const product = require('./products');
const users = require('./users');

module.exports = (app, jsonParser, urlencodedParser) => {
  transaction(app, jsonParser);
  report(app);
  img(app);
  img(app);
  product(app, jsonParser);
  users(app, jsonParser);
};
