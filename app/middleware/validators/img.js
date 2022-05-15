const { query } = require('express-validator');

exports.photo = () => query('photo').not().isEmpty();
