/* eslint-disable no-useless-escape */
/* eslint-disable prettier/prettier */
const { body } = require('express-validator');
const Users = require('../../schemas/User');
const errorMsg = require('../../data/error-message');
const User = require('../../schemas/User');

exports.emailExist = () =>
  body('email')
    .not()
    .isEmpty()
    .withMessage('Must be filled')
    .isEmail()
    .withMessage('Email is invalid')
    .custom((value) =>
      Users.find({ email: value }).then((data) => {
        if (data.length) {
          return Promise.reject(errorMsg.UserExist());
        }
        return Promise.resolve('');
      })
    );

exports.email = () =>
  body('email').not().isEmpty().withMessage('Email must be filled').isEmail()
  .withMessage('Email is invalid');

exports.putEmailVerification = () =>
  body('email').not().isEmpty().withMessage('Email must be filled').isEmail()
  .withMessage('Email is invalid').custom(async(email) => {
    const verificationCode = Math.floor(Math.random() * (9999 - 1000) + 1000);
    await User.findOneAndUpdate({ email }, { verificationCode }).then((data) => {
      if (data) {
        if (data.isEmailVerified) {
          return Promise.reject(errorMsg.EmailIsVerified());
        } 
          return Promise.resolve('');
      } 
        return User.create({ email, verificationCode }).then(() => Promise.resolve(''));
    });
  });

exports.subscribeUpdateEmail = () =>
  body('email').not().isEmpty().withMessage('Email must be filled').isEmail()
  .withMessage('Email is invalid');

exports.firstName = () =>
  body('firstName')
    .not()
    .isEmpty()
    .withMessage('Must be filled')
    .matches('^[a-zA-Z, ,-]+$')
    .withMessage(
      'First name is invalid. Uppercase, lowercase, space and "-" letters are allowed'
    );

exports.lastName = () =>
  body('lastName')
    .not()
    .isEmpty()
    .withMessage('Must be filled')
    .matches('^[a-zA-Z, ,-]+$')
    .withMessage(
      'Last name is invalid. Uppercase, lowercase, space and "-" letters are allowed'
    );

exports.phone = () =>
  body('phone')
    .not()
    .isEmpty()
    .withMessage('Phone must be filled')
    .isMobilePhone('any')
    .withMessage('Phone is invalid');

exports.passwordForLogin = () =>
  body('password')
    .not()
    .isEmpty()
    .withMessage('Must be filled')
    .isString()
    .withMessage('Must be string');

exports.password = () =>
  body('password')
    .not()
    .isEmpty()
    .withMessage('Must be filled')
    .isString()
    .withMessage('Must be string')
    .isLength({ min: 8 })
    .withMessage('Password must be 8 or more characters')
    .matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*([0-9]|[^\w\s]))')
    .withMessage('Password must have one uppercase and numbers');

exports.info = () => body('info').optional();

exports.verificationCode = () => body('verificationCode').not()
.isEmpty()
.withMessage('Verification code must be filled').isNumeric().withMessage('Verification code must be number');

exports.isRemember = () =>
  body('isRemember').optional().isBoolean().withMessage('Must be boolean');

exports.roles = () =>
  body('roles')
    .not()
    .isEmpty()
    .withMessage('Role must be checked')
    .isIn(['User', 'Volunteer', 'Shop'])
    .withMessage('Role is invalid');
