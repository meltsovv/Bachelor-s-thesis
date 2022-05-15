/* eslint-disable prefer-promise-reject-errors */
const { body } = require('express-validator');
const errorMsg = require('../../data/error-message');

exports.description = () => body('description').optional();

exports.price = () =>
  body('price')
    .not()
    .isEmpty()
    .withMessage('Must be filled')
    .isNumeric()
    .withMessage('Must be number');

exports.count = () =>
  body('count').optional().isNumeric().withMessage('Must be number');

exports.products = () =>
  body('products').custom((value) => {
    const products = JSON.parse(value);
    if (!products[0].count) {
      return Promise.reject(errorMsg.IsUndefined('count'));
    }
    if (!products[0].productType) {
      return Promise.reject(errorMsg.IsUndefined('productType'));
    }
    if (!products[0].productName) {
      return Promise.reject(errorMsg.IsUndefined('productName'));
    }
    if (!products[0].price) {
      return Promise.reject(errorMsg.IsUndefined('price'));
    }
    return Promise.resolve();
  });
