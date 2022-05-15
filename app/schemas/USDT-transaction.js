const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = mongoose.Schema(
  {
    balance: Number,
    from: String,
    to: String,
    value: String,
    data: {
      blockNumber: Number,
      blockHash: String,
      transactionIndex: Number,
      removed: Boolean,
      address: String,
      data: String,
      topics: [String],
      transactionHash: String,
      logIndex: Number,
      event: String,
      eventSignature: String,
    },
  },
  {
    timestamps: true,
  }
);
schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Usdt_transaction', schema);
