var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema(
  {
    productId: { type: String },
    productName: String,
    salePrice: Number,
    productImage: String,
    checked: String,
    productNum: String
  },
  {
    usePushEach: true
  }
);

module.exports = mongoose.model('Good', productSchema);
