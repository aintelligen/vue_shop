<template>
  <div>
    <nav-header></nav-header>
    <nav-bread></nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a
            href="javascript:void(0)"
            class="price cur"
            :class="{'price-up':this.sortFlag}"
            @click="sortGoods"
          >Price
            <img
              :src="this.sortFlag ? 'static/down.png' : 'static/up.png'"
              alt=""
            >
          </a>
          <a
            href="javascript:void(0)"
            class="filterby stopPop"
            @click="showFilterBy"
          >Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div
            class="filter stopPop"
            id="filter"
            :class="{'filterby-show':filterBy}"
          >
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a
                  href="javascript:void(0)"
                  :class="{'cur':priceLevel=='all'}"
                  @click="setPriceFilter('all')"
                >All</a></dd>
              <dd
                v-for="(price,index) in priceFilter"
                :key="index"
              >
                <a
                  href="javascript:void(0)"
                  @click="setPriceFilter(index)"
                  :class="{'cur':priceLevel==index}"
                >{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li
                  v-for="(item,index) in goodsList"
                  :key="index"
                >
                  <div class="pic">
                    <a href="#"><img
                        v-lazy="'/static/'+item.productImage"
                        alt=""
                      ></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a
                        href="javascript:;"
                        class="btn btn-cart"
                        @click="addCart(item.productId)"
                      >加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="busy"
                infinite-scroll-distance="30"
                class="loading-box"
              >
                <img
                  src="static/loading.gif"
                  v-show="endAjax && busy"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="md-overlay"
      v-show="overLayFlag"
      @click="closePop"
    ></div>
    <modal
      v-bind:mdShow="mdShow"
      v-on:close="closeModal"
    >
      <p slot="message">
        请先登录,否则无法加入到购物车中!
      </p>
      <div slot="btnGroup">
        <a
          class="btn btn--m"
          href="javascript:;"
          @click="mdShow = false"
        >关闭</a>
      </div>
    </modal>
    <modal
      v-bind:mdShow="mdShowCart"
      v-on:close="closeModal"
    >
      <p slot="message">
        <svg class="icon-status-ok">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#icon-status-ok"
          ></use>
        </svg>
        <span>加入购物车成!</span>
      </p>
      <div slot="btnGroup">
        <a
          class="btn btn--m"
          href="javascript:;"
          @click="mdShowCart = false"
        >继续购物</a>
        <router-link
          class="btn btn--m btn--red"
          href="javascript:;"
          to="/cart"
        >查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import NavBread from "@/components/NavBread";
import Modal from "@/components/Modal";
import Msg from "@/components/Msg";
import axios from "axios";
import util from "../util/utils";
export default {
  data() {
    return {
      goodsList: [],
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "100.00"
        },
        {
          startPrice: "100.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "5000.00"
        }
      ],
      priceLevel: "all",
      filterBy: false,
      overLayFlag: false,
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: true,
      mdShow: false,
      mdShowCart: false,
      endAjax: true
    };
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  mounted: function() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList(flag) {
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceLevel
      };
      axios
        .get("/goods/list", {
          params: param
        })
        .then(result => {
          var res = result.data;
          if (res.status === "0") {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.result.list);
              if (
                res.result.list === 0 ||
                res.result.list.length < this.pageSize
              ) {
                this.busy = true;
                this.endAjax = false;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.result.list;
              if (res.result.list.length < this.pageSize) {
                this.busy = true;
                this.endAjax = false;
              } else {
                this.busy = false;
              }
            }
          } else {
            this.goodsList = [];
            this.busy = false;
          }
        })
        .catch(err => {
          this.endAjax = false;
          Msg({
            content: "服务器开小差"
          });
        });
    },
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
    },
    sortDefault() {
      this.sortFlag = false;
      this.page = 1;
      this.getGoodsList();
    },
    showFilterBy() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    setPriceFilter(index) {
      this.priceLevel = index;
      this.page = 1;
      this.getGoodsList();
      this.closePop();
    },
    loadMore() {
      this.busy = true;
      this.endAjax = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 500);
    },
    addCart(productId) {
      if (util.checkToken()) {
        this.mdShow = true;
        return false;
      }
      axios
        .post("/users/addCart", {
          productId: productId,
          userName: util.getLocal("userName")
        })
        .then(res => {
          if (res.data.status === "0") {
            this.mdShowCart = true;
            this.$store.commit("updateCartCount", 1);
          } else {
            this.mdShow = true;
          }
        });
    },
    closeModal() {
      this.mdShow = false;
      this.mdShowCart = false;
    }
  }
};
</script>
<style scope>
.loading-box {
  text-align: center;
  padding-top: 20px;
}
.price img {
  display: inline-block;
  vertical-align: -2px;
}
</style>
