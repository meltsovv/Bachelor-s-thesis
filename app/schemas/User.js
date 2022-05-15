const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    isEmailVerified: { default: false, type: Boolean },
    verificationCode: Number,
    roles: [String],
    status: { default: 'INIT', type: String },
    registeredVia: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    phone: String,
    info: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Users', schema);
