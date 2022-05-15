const { body } = require('express-validator');
const commonValidators = require('../middleware/validators/common-validators');
const validators = require('../middleware/validators/validators');
const productsController = require('../controllers/product');
const upload = require('../services/multers/multer-csv.service');
const transformerProduct = require('../middleware/transformer/products');

module.exports = function (app, jsonParser) {
  app.get('/products', validators.productValidatorsGet, (req, res) => {
    productsController.getProducts(req, res);
  });

  app.get('/products/type', (req, res) => {
    productsController.getProductsTypes(req, res);
  });

  app.post(
    '/product',
    jsonParser,
    validators.productValidatorsPost,
    transformerProduct.toLowerCase,
    body('productName').custom((value) => value.toUpperCase()),
    (req, res) => {
      productsController.postProducts(req, res);
    }
  );

  app.post(
    '/products/file',
    upload.single('file'),
    commonValidators.jwtAuthorization(),
    (req, res) => {
      productsController.postProductsByFile(req, res);
    }
  );
};
