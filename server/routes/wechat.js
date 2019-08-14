var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// var Wechat = require('../models/wechat');

var config = {
  wechat: {
    token: '7689UDfjdieyrOIdufj',
    appId: 'wxa6caa23867ed445a',
    appsecret: '00dcfa0cb4f22ee62515448ceba9655c'
  }
};
// config
router.get('/', function(req, res, next) {
  res.json({
    code: '000000',
    result: {
      token: config.wechat.token
    }
  });
});

// isAuthorize
router.get('/isAuthorize', function(req, res, next) {
  res.json({
    code: '000000',
    result: {
      token: config.wechat.token,
      req: req
    }
  });
});

// openid
router.get('/getWachatOpid', function(req, res, next) {
  res.json({
    code: '000000',
    result: {
      token: config.wechat.token
    }
  });
});

// 支付
router.post('/payHandler', function(req, res, next) {
  res.json({
    code: '000000',
    result: {
      token: config.wechat.token
    }
  });
});

module.exports = router;
