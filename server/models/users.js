var mongoose = require('mongoose');
var userSchema = new mongoose.Schema(
  {
    userId: String,
    userName: String,
    userPwd: String,
    token: String,
    tokenExpires: Number,
    orderList: Array,
    cartList: [
      {
        productId: String,
        productName: String,
        salePrice: String,
        productImage: String,
        checked: String,
        productNum: String
      }
    ],
    addressList: [
      {
        addressId: String,
        userName: String,
        streetName: String,
        postCode: Number,
        tel: Number,
        isDefault: Boolean
      }
    ]
  },
  {
    usePushEach: true
  }
);
module.exports = mongoose.model('user', userSchema);
