const fs = require('fs');
const Report = require('../schemas/Report');
const errors = require('../middleware/errors/errors');
const StatusCodes = require('../data/status-codes');
const mailerService = require('../services/mailer.service');

exports.getReports = (req, res) => {
  if (!errors.ContainsError(req, res)) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const time = req.query.time || '';
    let filterByDate = {};
    switch (time) {
      case 'week':
        filterByDate = {
          createdAt: {
            $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000),
          },
        };
        break;
      case 'mounth':
        filterByDate = {
          createdAt: {
            $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000),
          },
        };
        break;
      default:
        break;
    }
    const options = {
      page,
      limit,
      collation: {
        locale: 'en',
      },
    };
    Report.paginate(filterByDate, options, (err, data) => {
      res.status(StatusCodes.OK).send({ data });
    });
  }
};

exports.addReport = (req, res) => {
  if (!errors.ContainsError(req, res)) {
    if (!req.files.length) {
      res.status(StatusCodes.OK).send({
        errors: [
          {
            value: [],
            msg: 'Photos is empty',
            param: 'photo',
            location: 'files',
          },
        ],
      });
    } else {
      const products = JSON.parse(req.body.products);
      Report.create({
        photos: req.files.map((el) => ({
          photo: el.filename,
        })),
        description: req.body.description,
        products,
        price: req.body.price,
      })
        .then((data) => {
          if (data) {
            mailerService.sendUpdatesForSubscribers(
              'Our team have added a new report'
            );
            res.status(StatusCodes.OK).send({ data });
          }
        })
        .catch((err) => {
          req.files
            .map((el) => ({
              photo: el.path,
            }))
            .forEach((element) => {
              const path = element.photo;
              fs.unlink(path, () => {
                res.status(StatusCodes.UNAUTHORIZED).json(err);
              });
            });
        });
    }
  } else {
    req.files
      .map((el) => ({
        photo: el.path,
      }))
      .forEach((element) => {
        const path = element.photo;
        fs.unlink(path);
      });
  }
};
