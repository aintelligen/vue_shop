<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Order List</span>
    </nav-bread>
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>My Order List</span></h2>
        </div>
        <div
          v-if="orderList.length<1"
          class="none-cartList"
        >
          <h3>Order List is Empty!</h3>
          <a
            href="#/"
            class="btn btn--m router-link-active"
          >Goods List</a>
        </div>
        <div v-else>
          <div
            class="item-list-wrap"
            v-for="(orders,keys) in orderList"
            :key="keys"
          >

            <div class="order-detail">
              <div class="cart-item">
                <div class="cart-item-head">
                  <ul>
                    <li>Items</li>
                    <li>Price</li>
                    <li>Quantity</li>
                    <li>Subtotal</li>
                  </ul>
                </div>
                <ul class="cart-item-list">
                  <li
                    v-for="(item,key) in orders.goodsList"
                    :key="key"
                  >
                    <div class="cart-tab-1">
                      <div class="cart-item-pic">
                        <img
                          v-lazy="'/static/'+item.productImage"
                          v-bind:alt="item.productName"
                        >
                      </div>
                      <div class="cart-item-title">
                        <div class="item-name">{{item.productName}}</div>
                      </div>
                    </div>
                    <div class="cart-tab-2">
                      <div class="item-price">{{item.salePrice|currency('￥')}}</div>
                    </div>
                    <div class="cart-tab-3">
                      <div class="item-quantity">
                        <div class="select-self select-self-open">
                          {{item.productNum}}
                        </div>
                      </div>
                    </div>
                    <div class="cart-tab-4">
                      <div class="item-price-total">{{(item.productNum*item.salePrice)|currency('￥')}}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div class="cart-foot-wrap">
              <div class="cart-foot-inner">
                <div class="cart-foot-l">
                  <div class="item-all-check">
                    Order Total: <span class="total-price">{{orders.orderTotal}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import NavHeader from "./../components/NavHeader";
import NavFooter from "./../components/NavFooter";
import NavBread from "./../components/NavBread";
import util from "../util/utils";
import axios from "axios";
import { currency } from "../util/currency";
export default {
  data() {
    return {
      orderList: [],
      orderType: ["Successfully Ordered", "Delivering", "Complete"]
    };
  },
  mounted() {
    this.init();
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread
  },
  filters: {
    currency: currency
  },
  methods: {
    init() {
      axios
        .post("/users/orderList", { userName: this.getAllState().userName })
        .then(response => {
          this.orderList = response.data.result;
        });
    },
    getAllState() {
      var state = this.$store.state;
      var objs = {};

      Object.keys(state).forEach(key => {
        objs[key] = util.getLocal(key);
      });

      return Object.assign({}, objs);
    }
  }
};
</script>
<style>
.item-list-wrap {
  margin-bottom: 50px;
  border: 1px solid #605f5f;
}
.item-list-wrap .order-header {
  font-size: 16px;
  text-transform: uppercase;
  padding: 0 10px;
}
.cart-item-list .cart-tab-3 {
  padding-top: 68px;
}
.cart-foot-wrap {
  margin-top: 0;
  border-top: 0;
}
.total-price {
  margin-left: 6px;
  color: #d1434a;
  font-size: 1.125em;
  font-weight: bold;
  line-height: 1.2;
}
@media only screen and (max-width: 991px) {
  .cart-item-list .cart-tab-3 {
    float: left;
    width: 50%;
    margin-top: 10px;
    padding: 8px 0 8px 10px;
    text-align: left;
    border-top: 1px solid #f0f0f0;
  }
  .cart-item-list .cart-tab-3 .item-quantity {
    position: relative;
    top: 6px;
  }
}
@media only screen and (max-width: 767px) {
  .cart-foot-wrap {
    position: relative;
  }
}
</style>
