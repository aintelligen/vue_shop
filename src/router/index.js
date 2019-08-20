import Vue from 'vue';
import Router from 'vue-router';
import GoodsList from '@/views/GoodsList';
import Cart from '@/views/Cart';
import Address from '@/views/Address';
import Image from '@/views/Image';
import OrderConfirm from '@/views/OrderConfirm';
import OrderSuccess from '@/views/OrderSuccess';
import OrderList from '@/views/OrderList';

import util from '../util/utils';
import Msg from '../components/Msg';

Vue.use(Router);
const Title = { template: '<div style="color:red;">Title</div>' };
const routes = [
  {
    path: '/',
    component: GoodsList,
    children: [
      {
        path: 'img',
        component: Image
      },
      {
        path: 'title',
        component: Title
      }
    ]
  },
  {
    path: '/cart',
    component: Cart
  },
  {
    path: '/address',
    component: Address
  },
  {
    path: '/orderList',
    component: OrderList
  },
  {
    path: '/orderConfirm',
    component: OrderConfirm
  },
  {
    path: '/orderSuccess',
    component: OrderSuccess
  }
];

routes.map(item => {
  if (item.path !== '/') {
    item.beforeEnter = (to, from, next) => {
      let status = util.checkToken();
      if (status) {
        util.removeLocal();
        Msg({
          content: '登录凭证失效,请重新登录'
        });
        next('/');
      } else {
        next();
      }
    };
  }
});
// console.log(routes);
export default new Router({
  routes: routes
});
