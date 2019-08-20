var express = require('express');
var router = express.Router();
var util = require('./../util/util');
var User = require('./../models/users');
var Goods = require('../models/goods');

// default result
const defaulRes = {
  userName: '',
  token: '',
  tokenExpires: 0
};

// expires time ms
const expires = 10 * 60 * 1000;

// 登录 userName userPwd
router.post('/login', function(req, res, next) {
  console.log('login');
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  User.findOne(param, function(err, doc) {
    console.log(err);
    console.log(doc);
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: defaulRes
      });
    } else {
      if (doc) {
        const tokenExpires = new Date().getTime() + expires;
        const token = util.md5('' + doc.userId + tokenExpires + util.md5(doc._id));
        doc.token = token;
        doc.tokenExpires = tokenExpires;
        doc.save(function(err1, doc1) {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
            });
          } else {
            req.session.userId = doc1.userId;
            res.json({
              status: '0',
              msg: '',
              result: {
                userName: doc1.userName,
                token: token,
                tokenExpires: tokenExpires
              }
            });
          }
        });
      } else {
        res.json({
          status: '1',
          msg: '账号或密码错误',
          result: defaulRes
        });
      }
    }
  });
});

//登出接口
router.post('/logout', function(req, res, next) {
  if (req.body.userName) {
    User.findOne({ userName: req.body.userName }, function(err, doc) {
      doc.token = '';
      doc.tokenExpires = 0;
      doc.save(function(err1) {
        if (err1) {
          res.json({
            status: '1',
            msg: '服务器错误',
            result: defaulRes
          });
        } else {
          res.json({
            status: '0',
            msg: '登出成功',
            result: defaulRes
          });
        }
      });
    });
  } else {
    res.json({
      status: '0',
      msg: '没有输入账号',
      result: defaulRes
    });
  }
});

// 检查登录是否失效
router.post('/checkLogin', function(req, res, next) {
  var userName = req.body.userName;
  var token = req.body.token;
  if (token && userName) {
    User.findOne({ userName: userName }, function(err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: '服务器错误',
          result: defaulRes
        });
      } else {
        if (doc) {
          console.log('checkLogin：' + doc.tokenExpires);
          if (doc.tokenExpires && doc.tokenExpires > new Date().getTime()) {
            res.json({
              status: '0',
              msg: 'token有效',
              result: {
                userName: doc.userName,
                token: doc.token,
                userId: doc.userId,
                tokenExpires: doc.tokenExpires
              }
            });
          } else {
            res.json({
              status: '1',
              msg: 'token失效',
              result: defaulRes
            });
          }
        } else {
          res.json({
            status: '1',
            msg: '账号名不存在',
            result: defaulRes
          });
        }
      }
    });
  } else {
    res.json({
      status: '1',
      msg: 'token失效',
      result: defaulRes
    });
  }
});
// 获取商品数量
router.post('/getCartCount', function(req, res, next) {
  if (req.body.userName) {
    User.findOne({ userName: req.body.userName }, function(err, doc) {
      if (err) {
        res.json({
          status: '0',
          msg: err.message
        });
      } else {
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function(item) {
          cartCount += parseFloat(item.productNum);
        });
        res.json({
          status: '0',
          msg: '',
          result: cartCount
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '当前用户不存在',
      result: []
    });
  }
});
//查询当前用户的购物车数据
router.post('/cartList', function(req, res, next) {
  var userName = req.body.userName;

  if (!util.isNull(userName)) {
    User.findOne({ userName: userName }, function(err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else {
        if (doc) {
          if (doc.tokenExpires > new Date().getTime()) {
            res.json({
              status: '0',
              msg: '',
              result: doc.cartList
            });
          } else {
            res.json({
              status: '1',
              msg: 'token失效',
              result: []
            });
          }
        } else {
          res.json({
            status: '0',
            msg: '没有查询到结果',
            result: []
          });
        }
      }
    });
  } else {
    console.log('null');
    res.json({
      status: '1',
      msg: '账号名不存在',
      result: defaulRes
    });
  }
});

//购物车删除
router.post('/cartDel', function(req, res, next) {
  var userName = req.body.userName,
    productId = req.body.productId;
  User.update(
    {
      userName: userName
    },
    {
      $pull: {
        cartList: {
          productId: productId
        }
      }
    },
    function(err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        });
      }
    }
  );
});

//修改商品数量
router.post('/cartEdit', function(req, res, next) {
  var userName = req.body.userName,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update(
    { userName: userName, 'cartList.productId': productId },
    {
      'cartList.$.productNum': productNum,
      'cartList.$.checked': checked
    },
    function(err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        });
      }
    }
  );
});
// 修改选择商品状态
router.post('/editCheckAll', function(req, res, next) {
  var userName = req.body.userName,
    checkAll = req.body.checkAll ? '1' : '0';
  User.findOne({ userName: userName }, function(err, user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (user) {
        user.cartList.forEach(item => {
          item.checked = checkAll;
        });
        user.save(function(err1, doc) {
          if (err1) {
            res.json({
              status: '1',
              msg: err1,
              message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        });
      }
    }
  });
});
//查询用户地址接口
router.post('/addressList', function(req, res, next) {
  var userName = req.body.userName;
  User.findOne({ userName: userName }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var list = [].concat(doc.addressList);
      list.map(item => {
        item._id = '';
      });
      res.json({
        status: '0',
        msg: '',
        result: list
      });
    }
  });
});
//设置默认地址接口
router.post('/setDefault', function(req, res, next) {
  var userName = req.body.userName,
    addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'addressId is null',
      result: ''
    });
  } else {
    User.findOne({ userName: userName }, function(err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else {
        var addressList = doc.addressList;
        addressList.forEach(item => {
          if (item.addressId == addressId) {
            item.isDefault = true;
          } else {
            item.isDefault = false;
          }
        });

        doc.save(function(err1, doc1) {
          if (err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: ''
            });
          }
        });
      }
    });
  }
});

//删除地址接口
router.post('/delAddress', function(req, res, next) {
  var userName = req.body.userName,
    addressId = req.body.addressId;
  User.update(
    {
      userName: userName
    },
    {
      $pull: {
        addressList: {
          addressId: addressId
        }
      }
    },
    function(err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: '0',
          msg: '',
          result: ''
        });
      }
    }
  );
});
//新增地址接口
router.post('/addAddress', function(req, res, next) {
  var userName = req.body.userName;
  var addObj = req.body.addObj;
  User.findOne(
    {
      userName: userName
    },
    function(err, doc) {
      var list = doc.addressList.sort(function(a, b) {
        return Number(a.addressId) - Number(b.addressId);
      });
      var lastId = Number(list[list.length - 1].addressId) + 1;
      console.log(lastId);
      addObj.addressId = lastId;
      addObj.postCode = lastId;

      doc.addressList.push(addObj);
      doc.save(function(err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: '增加地址失败'
          });
        } else {
          res.json({
            status: '0',
            msg: '',
            result: '增加地址成功'
          });
        }
      });
    }
  );
});
// 下单
router.post('/payMent', function(req, res, next) {
  var userName = req.body.userName,
    addressId = req.body.addressId,
    orderTotal = req.body.orderTotal;
  User.findOne({ userName: userName }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var address = '',
        goodsList = [];
      //获取当前用户的地址信息
      console.log(addressId);
      doc.addressList.forEach(item => {
        if (addressId == item.addressId) {
          address = item;
        }
      });
      //获取用户购物车的购买商品
      doc.cartList.filter(item => {
        if (item.checked == '1') {
          goodsList.push(item);
        }
      });

      if (!address) {
        res.json({
          status: '1',
          msg: '地址没有填写',
          result: ''
        });
      } else {
        var platform = '622';
        var r1 = Math.floor(Math.random() * 10);
        var r2 = Math.floor(Math.random() * 10);

        var sysDate = new Date().Format('yyyyMMddhhmmss');
        var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
        var orderId = platform + r1 + sysDate + r2;
        var order = {
          orderId: orderId,
          orderTotal: orderTotal,
          addressInfo: address,
          goodsList: goodsList,
          orderStatus: '0',
          createDate: createDate
        };

        doc.orderList.push(order);
        doc.cartList = [];

        doc.save(function(err1, doc1) {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.msg,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: {
                orderId: order.orderId,
                orderTotal: order.orderTotal
              }
            });
          }
        });
      }
    }
  });
});
//根据订单Id查询订单信息
router.post('/orderDetail', function(req, res, next) {
  var userName = req.body.userName,
    orderId = req.body.orderId;
  User.findOne({ userName: userName }, function(err, userInfo) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var orderList = userInfo.orderList;
      if (orderList.length > 0) {
        var orderTotal = 0;
        orderList.forEach(item => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal;
          }
        });
        if (orderTotal > 0) {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          });
        } else {
          res.json({
            status: '1',
            msg: '无此订单',
            result: ''
          });
        }
      } else {
        res.json({
          status: '1',
          msg: '当前用户未创建订单',
          result: ''
        });
      }
    }
  });
});
// 根据用户名所有订单列表
router.post('/orderList', function(req, res, next) {
  var userName = req.body.userName;
  User.findOne({ userName: userName }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      /* doc.orderList = [];
      doc.save(); */
      res.json({
        status: '1',
        msg: '查询订单列表成功',
        result: doc.orderList
      });
    }
  });
});
// 加入购物车
router.post('/addCart', function(req, res, next) {
  var userName = req.body.userName;
  productId = req.body.productId;
  var User = require('../models/users');
  User.findOne(
    {
      userName: userName
    },
    function(err, userDoc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        });
      } else {
        if (userDoc) {
          let goodsItem = '';
          userDoc.cartList.forEach(function(item) {
            if (item.productId === productId) {
              goodsItem = item;
              item.productNum++;
              console.log('add 1');
            }
          });
          if (goodsItem) {
            userDoc.save(function(err2, doc2) {
              if (err2) {
                res.json({
                  status: '1',
                  msg: err.message
                });
              } else {
                res.json({
                  status: '0',
                  msg: '',
                  result: 'suc'
                });
              }
            });
          } else {
            Goods.findOne({ productId: productId }, function(err1, doc1) {
              if (err1) {
                res.json({
                  status: '1',
                  msg: err.message
                });
              } else {
                if (doc1) {
                  // 保存到数据库 需要在模型里面添加
                  doc1.productNum = 1;
                  doc1.checked = 1;
                  userDoc.cartList.push(doc1);
                  console.log('create 1');
                  userDoc.save(function(err2, doc2) {
                    if (err2) {
                      res.json({
                        status: '1',
                        msg: err.message
                      });
                    } else {
                      res.json({
                        status: '0',
                        msg: '',
                        result: 'suc'
                      });
                    }
                  });
                }
              }
            });
          }
        }
      }
    }
  );
});
module.exports = router;
