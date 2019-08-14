var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wechatSchema = new Schema({
  amt: Number,
  orderNO: String
});

module.exports = mongoose.model('Wechat', wechatSchema);
