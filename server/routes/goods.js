var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/imooc-shop', { useMongoClient: true });

mongoose.connection.on('connected', function(data) {
  console.log('Mongoose connected success');
});

mongoose.connection.on('error', function(data) {
  console.log('Mongoose connected error');
});

mongoose.connection.on('disconnected', function(data) {
  console.log('Mongoose connected disconnected');
});

// 查询商品列表数据
router.get('/list', function(req, res, next) {
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);
  let sort = parseInt(req.query.sort);
  let priceLevel = req.query.priceLevel;
  let skip = (page - 1) * pageSize;
  let priceGt = '',
    priceLte = '';
  let params = {};
  if (priceLevel !== 'all' && priceLevel !== undefined && priceLevel !== null) {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLte = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    };
  }
  //db.goods.find({salePrice:{$gt:0,$lte:100}}).skip(0).limit(8).sort({'salePrice':1})
  let goodsModel = Goods.find(params)
    .skip(skip)
    .limit(pageSize);
  goodsModel.sort({ salePrice: sort });

  goodsModel.exec(function(err, doc) {
    if (err) {
      res.json({
        staus: '1',
        msg: err.message
      });
    } else {
      //console.log("doc: "+doc);
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  });
});

module.exports = router;
