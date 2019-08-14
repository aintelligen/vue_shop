import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import Image from '@/views/Image'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'


Vue.use(Router)
const Title = { template: '<div style="color:red;">Title</div>' }
export default new Router({
  routes: [
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
      path: '/orderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderSuccess',
      component: OrderSuccess
    }

  ]
})
