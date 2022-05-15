const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = mongoose.Schema(
  {
    type: String,
    productName: String,
    count: Number,
    packing: String,
    size: String,
    photo: String,
    isBought: { default: false, type: Boolean },
  },
  {
    timestamps: true,
  }
);
schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', schema);
