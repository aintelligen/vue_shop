<template>
  <div>
    <nav-header></nav-header>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>Confirm</span> address</li>
          <li class="cur"><span>View your</span> order</li>
          <li class="cur"><span>Make</span> payment</li>
          <li class="cur"><span>Order</span> confirmation</li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic"><img
            src="/static/ok-2.png"
            alt=""
          ></div>
        <div class="order-create-main">
          <h3>Congratulations! <br>Your order is under processing!</h3>
          <p>
            <span>Order ID：{{orderId}}</span>
            <span>Order total：{{orderTotal|currency('￥')}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link
                class="btn btn--m"
                to="/"
              >Goods List</router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link
                class="btn btn--m"
                to="/orderList"
              >Order List</router-link>
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
import { currency } from "./../util/currency";
import util from "../util/utils";
import axios from "axios";
export default {
  data() {
    return {
      orderId: "",
      orderTotal: 0
    };
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
    getAllState() {
      var state = this.$store.state;
      var objs = {};

      Object.keys(state).forEach(key => {
        objs[key] = util.getLocal(key);
      });

      return Object.assign({}, objs);
    }
  },
  mounted() {
    var orderId = this.$route.query.orderId;
    console.log("orderId:" + orderId);
    if (!orderId) {
      return;
    }
    axios
      .post("/users/orderDetail", {
        orderId: orderId,
        userName: this.getAllState().userName
      })
      .then(response => {
        let res = response.data;
        if (res.status == "0") {
          this.orderId = orderId;
          this.orderTotal = res.result.orderTotal;
        }
      });
  }
};
</script>
