// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueLazyLoad from 'Vue-lazyload';
import VueinFiniteScroll from 'vue-infinite-scroll';
import Vuex from 'vuex';

import './assets/css/base.css';
import './assets/css/checkout.css';
import './assets/css/product.css';
import axios from 'axios';

axios.defaults.baseURL = window.location.href.match(/192.|127.|localhost/gim) ? 'http://localhost:3300' : '';

Vue.use(Vuex);
Vue.use(VueLazyLoad, {
  loading: '/static/loading-svg/loading-bars.svg'
});
Vue.use(VueinFiniteScroll);
Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount;
    },
    initCartCount(state, num) {
      state.cartCount = num;
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
});
