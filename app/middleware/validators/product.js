/* eslint-disable prefer-promise-reject-errors */
const { body, query } = require('express-validator');
const Product = require('../../schemas/Product');
const errorMsg = require('../../data/error-message');

exports.isBought = () =>
  body('isBought').optional().isBoolean().withMessage('Must be boolean');

exports.queryType = () =>
  query('type')
    .optional()
    .custom((value) =>
      Product.find({ type: value }, 'type').then((data) => {
        if (!data.length) {
          return Promise.reject(errorMsg.IsNotFound('type'));
        }
        return Promise.resolve('');
      })
    );

exports.query = () => query('query').optional();

exports.size = () => body('size').optional();

exports.type = () => body('type').not().isEmpty().withMessage('Must be filled');

exports.packing = () => body('packing').optional();

exports.productName = () =>
  body('productName').not().isEmpty().withMessage('Must be filled');

exports.count = () =>
  body('count')
    .not()
    .isEmpty()
    .withMessage('Must be filled')
    .isNumeric()
    .withMessage('Must be number');
