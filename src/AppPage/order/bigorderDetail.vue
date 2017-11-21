<template lang="html">
  <div v-if="details">

    <div class="contract">联系人：<span class="contract-people">{{ details.contact }}</span>联系方式：<span>{{ details.mobile }}</span></div>
    <div class="list">
      <div class="item" v-for="(item , index) in details.resources" :key="index">

        <div class="head">
          <div class="title ellipsis bold">{{ item.field_name }}</div>
          <div class="status" v-if="item.group_purchase_id">
             <div class="status" v-if="item.order_status=='paid' || (item.order_status=='approved'&& item.group_status==0)">拼团中</div>
              <div class="status success" v-if="item.order_status=='finished'||item.order_status=='reviewed' || (item.order_status=='approved'&& item.group_status==1) ">参团成功</div>
              <div class="status" v-if="item.order_status=='approved'&& item.group_status==2">参团失败</div>
              <div class="status" v-if="item.order_status=='canceled'">参团失败</div>
          </div>
          <div class="status" v-else>{{ item.status }}</div>

        </div>
        <div class="content">
          <div class="img-box">
            <img v-lazy="item.pic_url" :data-srcset="item.pic_url | small" alt="a">
          </div>
          <div class="norms">
            <p class="time">时间：<span>{{ item.start }}</span></p>
            <p class="norm">规格：<span>{{ item.size }}（{{ item.lease_term_type }}）</span></p>
            <span class="customs" v-if="item.custom_dimension">{{ item.custom_dimension }}</span>
          </div>

          <div class="price-box" v-if="item.subsidy_fee > 0">
            <p class="discount-price">¥<span>{{ (item.price - item.subsidy_fee)/100 | twoPoint }}</span></p>
            <del class="original-price">¥<span>{{ item.price/100 | twoPoint }}</span></del>
          </div>
          <div class="price-box" v-else>
            <p class="discount-price">¥<span>{{ item.price/100 | twoPoint }}</span></p>
          </div>
        </div>
        <div class="other-info">
          <div class="box">
            <p><span class="info-left">其他需求：</span><span class="info-right">
              <span v-if="details.need_decoration">需要布置</span>
              <span v-if="details.need_transportation">需要运输</span>
              <span v-if="details.delegated">需要兼职</span>
            </span></p>
            <p class="second-info"><span class="info-left worlds">留&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;言：</span><span class="info-right">{{ item.leave_words }}</span></p>
          </div>
        </div>

        <div class="canceled-icon" v-if="item.status=='已拒绝'"></div>
        <div class="btn-box" v-if="item.status=='待审核'">
          <div class="btn" @click="showServer">催审核</div>
        </div>
        <div class="btn-box" v-else-if="item.status=='进行中'">
          <span class="contract-us" @click="telUs( item.service_phone.split(',')[0] )">联系我们</span>
          <router-link :to="{ name : 'appDealVoucher' , params : {id: item.field_order_item_id} }" class="deal">交易凭证</router-link>
        </div>
        <div class="canceled-info" v-else-if="item.status=='已拒绝'">
          <p class="bold">拒绝原因：<span>{{ item.objection }}</span></p>
        </div>
        <div class="btn-box" v-else="item.status=='待评价'">
          <router-link :to="{ name : 'appDealVoucher' , params : {id: item.field_order_item_id} }" class="deal-voucher">交易凭证</router-link>

          <span @click="goComment(item.field_order_item_id)" class="comment">评价赚积分</span>
        </div>
      </div>
    </div>
    <div class="order-info">
      <p>订单编号：<span>{{ details.order_num }}</span></p>
      <p>创建时间：<span>{{ details.created_at }}</span></p>
    </div>
  </div>
</template>

<script>
  function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
    } else {
      document.addEventListener(
        'WebViewJavascriptBridgeReady'
        , function() {
          callback(WebViewJavascriptBridge)
        },
        false
      );
    }

    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
  }
  import { getOrdersDetail } from 'src/service/getData';
  import { twoPoint , small , twoPointPre , twoPointNext , payModel} from 'src/filters/index';
export default {
  data () {
    return {
      status : 'finished' , // 订单状态
      details : null , // 大订单详情
    }
  },
  filters : { twoPoint , small , twoPointPre , twoPointNext , payModel},

  created(){
     this.status = this.$route.query.status || 'finished' ;
  },
  mounted(){
    let id = this.$route.params.id ;
    getOrdersDetail(id).then(res => {
      this.details = res.result ;
    }).catch(err => {
      this.$vux.toast.text(err.msg);
    });
    _MEIQIA('init');
  },
  methods:{
    goComment(id){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('commentsOrder', id , function (data) {}) ;
      });
    },
    showServer(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('contactLinHuiServer', "邻汇客服" , function (data) {}) ;
      });
    },
    telUs(m){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('telUs', m , function (data) {}) ;
      });
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .contract{
    padding: 0 0.24rem;
    line-height: 1.04rem;
    color: #1e1e1e;
    background-color: #fff;
    .contract-people{
      margin-right: 0.6rem;
    }
  }
  .item{
    position: relative;
    margin-top: 0.2rem;
    background-color: #fff;
    >a{
      display: block;
    }
    .head{
      display: flex;
      justify-content: space-between;
      padding: 0 0.24rem;
      line-height: 0.9rem;
      font-size: 0.24rem;
      .title{
        width: 5.34rem;
      }
      .status{
        color: $red;
        &.finished{
          color: $green;
        }
        &.success{
          color: $green;
        }
      }
    }
    .content{
      display: flex;
      padding: 0.2rem 0.24rem;
      background-color:  #F1F2F7;
      .img-box{
        margin-right: 0.2rem;
        >img{
          @include wh( 1.36rem , 1.36rem );
        }
      }
      .norms{
        width: 3.76rem;
        margin-right: 0.2rem;
        .time{
          margin-top: 0.1rem;
          font-size: 0.24rem;
          color: $fontColor;
        }
        .norm{
          margin-top: 0.18rem;
          font-size: 0.22rem;
          color: #999;
        }
        .customs{
          display: inline-block;
          margin-top: 0.18rem;
          padding: 0 0.06rem;
          line-height: 0.3rem;
          border: 1px solid #666;
          border-radius: 0.04rem;
          font-size: 0.2rem;
          color: $fontColor;
        }
      }
      .price-box{
        width: 1.46rem;
        text-align: right;
        font-size: 0.24rem;
        .discount-price{
          margin-top: 0.54rem;
          color: $fontColor;
        }
        .original-price{
          display: block;
          margin-top: 0.18rem;
          color: #999;
        }
      }
    }
    .other-info{
      padding: 0 0.24rem 0.15rem;
      background-color: #F1F2F7;
      .box{
        padding-top: 0.15rem;
        border-top: 1px solid rgba(0,0,0,0.1);
        .second-info{
          margin-top: 0.12rem;
        }
        .info-left{
          font-size: 0.22rem;
          color: #999;
        }
        .info-right{
          font-size: 0.22rem;
          color: #000;
        }
      }

    }
    .btn-box{
      padding: 0.5rem 0.24rem 0.46rem;
      display: flex;
      justify-content: space-between;
      .btn{
        width: 100%;
        line-height: 0.68rem;
        border: 1px solid $mainColor;
        border-radius: 0.08rem;
        color: $mainColor;
        font-size: 0.3rem;
        text-align: center;
      }
      .contract-us{
        @include wh( 3.29rem , 0.68rem );
        border: 1px solid #d8d8d8;
        line-height: 0.68rem;
        text-align: center;
        color: #666;
        font-size: 0.28rem;
        border-radius: 0.08rem;
      }
      .deal{
        @include wh( 3.29rem , 0.68rem );
        border: 1px solid $mainColor;
        line-height: 0.68rem;
        text-align: center;
        color: $mainColor;
        font-size: 0.28rem;
        border-radius: 0.08rem;
      }
      .deal-voucher{
        @include wh( 3.29rem , 0.68rem );
        border: 1px solid #d8d8d8;
        line-height: 0.68rem;
        text-align: center;
        color: #666;
        font-size: 0.28rem;
        border-radius: 0.08rem;
      }
      .comment{
        @include wh( 3.29rem , 0.68rem );
        border: 1px solid $orange;
        line-height: 0.68rem;
        text-align: center;
        color: $orange;
        font-size: 0.28rem;
        border-radius: 0.08rem;
      }
    }
    .canceled-info{
      padding: 0.3rem 0.24rem;
      font-size: 0.24rem;
    }
    .canceled-icon{
      position: absolute;
      top: 1.6rem;
      right: 0.72rem;
      @include wh( 1.6rem , 1.6rem );
      @include bg-image('../../images/ic_rejected');
    }
  }
  .order-info{
    margin-top: 0.2rem;
    padding: 0.3rem 0.24rem;
    background-color: #fff;
    font-size: 0.24rem;
    color: #999;
    >p:nth-of-type(2){
      margin-top: 0.15rem;
    }
  }
</style>
