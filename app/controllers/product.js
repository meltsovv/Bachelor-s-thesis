const StatusCodes = require('../data/status-codes');
const errors = require('../middleware/errors/errors');
const Product = require('../schemas/Product');
const productService = require('../services/products.service');
const mailerService = require('../services/mailer.service');

exports.getProducts = (req, res) => {
  if (!errors.ContainsError(req, res)) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const query = req.query.query || '';
    const { type } = req.query;
    const dataQuery = { productName: { $regex: query.toLowerCase() } };
    if (type) {
      dataQuery.type = type;
    }
    const options = {
      page,
      limit,
      collation: {
        locale: 'en',
      },
    };
    Product.paginate(dataQuery, options, (err, data) => {
      res.status(StatusCodes.OK).send({ data });
    });
  }
};

exports.getProductsTypes = (req, res) => {
  Product.find({}, 'type', (err, data) => {
    const arrayOfTypes = [];
    data.forEach((element) => {
      if (!arrayOfTypes.includes(element.type)) {
        arrayOfTypes.push(element.type);
      }
    });
    res.status(StatusCodes.OK).send({ data: arrayOfTypes });
  });
};

exports.postProducts = (req, res) => {
  if (!errors.ContainsError(req, res)) {
    Product.create(req.body).then((data) => {
      if (data) {
        mailerService.sendUpdatesForSubscribers(
          'Our team have added new goods of needs'
        );
        res.status(StatusCodes.OK).send({ data });
      }
    });
  }
};

exports.postProductsByFile = (req, res) => {
  if (!errors.ContainsError(req, res)) {
    if (!req.file) {
      res.status(StatusCodes.UNAUTHORIZED).send({
        errors: [
          {
            value: [],
            msg: 'File is empty',
            param: 'file',
            location: 'files',
          },
        ],
      });
    } else {
      productService.productsUploadByCsv(req, res);
    }
  }
};
