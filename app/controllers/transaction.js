/* eslint-disable camelcase */
/* eslint-disable node/no-unsupported-features/es-syntax */
const stripe = require('stripe')(process.env.SECRET_KEY_STRIPE);

const UsdtTransaction = require('../schemas/USDT-transaction');
const CreditTransaction = require('../schemas/Credit-transaction');
const errors = require('../middleware/errors/errors');
const StatusCodes = require('../data/status-codes');
const encryptionService = require('../services/encryption.service');

exports.getUsdtTransactions = (req, res) => {
  if (!errors.ContainsError(req, res)) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const options = {
      page,
      limit,
      collation: {
        locale: 'en',
      },
    };
    UsdtTransaction.paginate({}, options, (err, data) => {
      res.status(StatusCodes.OK).send({ data });
    });
  }
};

exports.getCreditTransaction = (req, res) => {
  if (!errors.ContainsError(req, res)) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const options = {
      page,
      limit,
      collation: {
        locale: 'en',
      },
    };
    CreditTransaction.paginate({}, options, (err, data) => {
      const transformedData = data;
      transformedData.docs = transformedData.docs.map((el) => ({
        event_id: el.event_id,
        pament_id: el.pament_id,
        object: el.object,
        amount: el.amount,
        amount_received: el.amount_received,
        currency: el.currency,
        billing_details: JSON.parse(
          encryptionService.decrypt(el.billing_details)
        ),
        payment_method_details: JSON.parse(
          encryptionService.decrypt(el.payment_method_details)
        ),
      }));
      res.status(StatusCodes.OK).send({ data: transformedData });
    });
  }
};

exports.getTotalInfo = (req, res) => {
  UsdtTransaction.find({ to: process.env.ADDRESS }).then((data) => {
    const total = {
      donators: 0,
      start: data[0].createdAt,
      donated: 0,
    };
    const separateAddresses = [];
    data.forEach((transaction) => {
      if (
        !separateAddresses.includes(transaction.from) &&
        transaction.from !== process.env.ADDRESS
      ) {
        separateAddresses.push(transaction.from);
      }
      if (transaction.from !== process.env.ADDRESS) {
        total.donated += Number(transaction.value);
      }
    });
    total.donators = separateAddresses.length;
    CreditTransaction.find({}).then((credits) => {
      const separateEmails = [];
      credits.forEach((transaction) => {
        if (!separateEmails.includes(transaction.email)) {
          separateEmails.push(transaction.email);
        }
        total.donated += Number(transaction.amount);
      });
      total.donators += separateEmails.length;
      total.start =
        new Date(data[0].createdAt) < new Date(credits[0].createdAt)
          ? data[0].createdAt
          : credits[0].createdAt;
      res.status(StatusCodes.OK).send({
        data: total,
      });
    });
  });
};

exports.createPaymentLink = async (req, res) => {
  if (!errors.ContainsError(req, res)) {
    const { currency, description, amount, success_url, cancel_url } = req.body;
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: description,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url,
      cancel_url,
    });
    res.status(StatusCodes.OK).send({ url: session.url });
  }
};

exports.createCreditTransaction = async (req, res) => {
  if (!errors.ContainsError(req, res)) {
    const { object } = req.body.data;
    CreditTransaction.create({
      event_id: req.body.id,
      pament_id: object.id,
      object: object.object,
      amount: object.amount / 100,
      amount_received: object.amount_received / 100,
      currency: object.currency,
      email: object.charges.data.map((el) => el.billing_details)[0].email,
      billing_details: encryptionService.encrypt(
        JSON.stringify(object.charges.data.map((el) => el.billing_details))
      ),
      payment_method_details: encryptionService.encrypt(
        JSON.stringify(
          object.charges.data.map((el) => el.payment_method_details)
        )
      ),
    });
    res.json({ received: true });
  }
};
