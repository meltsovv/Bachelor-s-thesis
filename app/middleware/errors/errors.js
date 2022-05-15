/* eslint-disable consistent-return */
const { validationResult } = require('express-validator');
const StatusCodes = require('../../data/status-codes');
const errorMsg = require('../../data/error-message');

exports.ContainsError = (req, res) => {
  const errors = validationResult(req);
  if (errors.errors.find((el) => el.param === 'authorization')) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ errors: errors.array() });
  }
  if (
    errors.errors.find(
      (el) =>
        el.msg === errorMsg.UserExist() || el.msg === errorMsg.EmailIsVerified()
    )
  ) {
    return res.status(StatusCodes.FORBIDDEN).json({ errors: errors.array() });
  }
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
};

exports.CustomErrors = (value, msg, param, location) => ({
  errors: [
    {
      value,
      msg,
      param,
      location,
    },
  ],
});
