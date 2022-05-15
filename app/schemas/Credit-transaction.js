const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = mongoose.Schema(
  {
    event_id: String,
    pament_id: String,
    object: String,
    amount: Number,
    amount_received: Number,
    currency: String,
    email: String,
    billing_details: String,
    payment_method_details: String,
  },
  {
    timestamps: true,
  }
);
schema.plugin(mongoosePaginate);

module.exports = mongoose.model('credit_transaction', schema);
