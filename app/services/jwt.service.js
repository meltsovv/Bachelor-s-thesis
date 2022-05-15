/* eslint-disable node/no-unsupported-features/es-syntax */
const jwt = require('jsonwebtoken');

exports.jwtSign = (data, expiresIn) =>
  jwt.sign(data, process.env.AUTHORIZATION, {
    algorithm: 'HS384',
    ...(expiresIn ? { expiresIn: '24h' } : {}),
  });

exports.jwtVerify = (token) => jwt.verify(token, process.env.AUTHORIZATION);

exports.jwtDecode = (token) => jwt.decode(token, { complete: true });
