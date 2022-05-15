const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = mongoose.Schema(
  {
    photos: [
      {
        photo: String,
      },
    ],
    description: String,
    products: [
      {
        count: Number,
        productName: String,
        productType: String,
        packing: String,
        size: String,
        price: Number,
      },
    ],
    price: Number,
  },
  {
    timestamps: true,
  }
);
schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Report', schema);
