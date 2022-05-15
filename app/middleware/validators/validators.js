const productValidator = require('./product');
const reportValidators = require('./report');
const transactionValidators = require('./transactions');
const usersValidators = require('./users');
const commonValidators = require('./common-validators');

exports.productValidatorsPost = [
  commonValidators.jwtAuthorization(),
  commonValidators.limit(),
  productValidator.isBought(),
  productValidator.size(),
  productValidator.type(),
  productValidator.packing(),
  productValidator.productName(),
  productValidator.count(),
];

exports.productValidatorsGet = [
  commonValidators.limit(),
  productValidator.query(),
  productValidator.queryType(),
];

exports.reportValidatorsPost = [
  commonValidators.jwtAuthorization(),
  reportValidators.description(),
  reportValidators.price(),
  reportValidators.count(),
  reportValidators.products(),
];

exports.createPaymentLink = [
  transactionValidators.amount(),
  transactionValidators.success_url(),
  transactionValidators.cancel_url(),
  transactionValidators.currency(),
  transactionValidators.description(),
];

exports.registerValidators = [
  usersValidators.email(),
  usersValidators.roles(),
  usersValidators.password(),
];

exports.registerIdentityValidators = [
  usersValidators.firstName(),
  usersValidators.lastName(),
  usersValidators.phone(),
  usersValidators.info(),
  commonValidators.jwtAuthorization(),
];

exports.loginValidators = [
  usersValidators.email(),
  usersValidators.passwordForLogin(),
  usersValidators.isRemember(),
];
