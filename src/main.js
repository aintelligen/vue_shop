// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueLazyLoad from 'vue-lazyload';
import VueinFiniteScroll from 'vue-infinite-scroll';
import Vuex from 'vuex';
import Msg from './components/Msg';

import './assets/css/base.css';
import './assets/css/checkout.css';
import './assets/css/product.css';
import axios from 'axios';

import util from './util/utils';

Vue.use(Vuex);
Vue.use(VueLazyLoad, {
  loading: '/static/loading-svg/loading-bars.svg'
});
Vue.use(VueinFiniteScroll);

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    userName: '',
    cartCount: 0,
    token: '',
    tokenExpires: 0
  },
  mutations: {
    updateUserInfo(state, obj) {
      Object.assign(state, obj);
      Object.keys(state).forEach(key => {
        util.setLocal(key, obj[key]);
        state[key] = obj[key] ? obj[key] : '';
      });
    },
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount;
    },
    initCartCount(state, num) {
      state.cartCount = num;
    }
  }
});

// axios

axios.defaults.baseURL = window.location.href.match(/192.|127.|localhost/gim) ? 'http://localhost:3333' : '';
axios.defaults.headers.common['token'] = util.getLocal('token') ? util.getLocal('token') : '';
const filterApi = ['/login', '/checkLogin', '/goods/list'];
var CancelToken = axios.CancelToken;
var source = CancelToken.source();
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    const isFilter = !Boolean(filterApi.find(item => config.url.indexOf(item) > -1));
    if (isFilter && util.checkToken()) {
      Msg({
        content: '登录凭证失效,请重新登录'
      });
      source.cancel('token过期');
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    console.log('请求错误');
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(res) {
    // 对响应数据做点什么
    if (res.config.url.indexOf('login') > -1) {
      util.setObjLocal(res.data.result);
    }
    return res;
  },
  function(error) {
    // 对响应错误做点什么
    console.log('响应错误');
    return Promise.reject(error);
  }
);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
});
