<template lang="html">
  <div class="orderDetail-wraper" v-if="details">
    <v-head isFixed="true" goBack="true">
      <div slot="center-part">订单详情</div>
    </v-head>
    <div class="pay-info">
      <p class="status" v-if="group">拼团订单</p>
      <p class="status" v-else>待支付</p>
      <p class="text">请在48小时内支付完成，否则订单将被取消</p>
      <p class="time">{{ details.created_at }}</p>
    </div>
    <div class="order-info">
      <div class="order-id">订单号：<span>{{ details.order_num }}</span></div>
      <div class="contract">联系人：<span class="contract-people">{{ details.contact }}</span>联系方式：<span>{{ details.mobile }}</span></div>
    </div>
    <div class="list">
      <div class="item" v-for="(item , index) in details.resources" :key="index">
        <div class="title ellipsis">{{ item.field_name }}</div>
        <div class="content">
          <div class="img-box">
            <img v-lazy="item.pic_url" :data-srcset="item.pic_url | small" alt="a">
          </div>
          <div class="norms">
            <p class="time">时间：<span>{{ item.start }}</span></p>
            <p class="norm">规格：<span>{{ item.size }}（{{ item.lease_term_type }}）</span></p>
            <span class="customs" v-if="item.custom_dimension">{{ item.custom_dimension }}</span>
          </div>
          <div class="price-box" v-if="item.subsidy_fee>0">
            <p class="discount-price">¥<span>{{ (item.price-item.subsidy_fee)/100 | twoPoint }}</span></p>
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
              <span v-if="details.delegated">需要兼职</span></span>
            </p>
            <p class="second-info"><span class="info-left worlds">留&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;言：</span><span class="info-right">{{ item.leave_words }}</span></p>
          </div>
        </div>
        <div class="price">
          <span class="price-pre">¥</span><span class="price-num">{{ (item.price-item.subsidy_fee)/100 | twoPointPre }}.</span><span class="price-next">{{ item.price/100 | twoPointNext }}</span><span class="deposit" v-if="item.deposit">(含押金¥{{ item.deposit | twoPoint }})</span>
        </div>
      </div>
    </div>
    <div class="submit-pannel">
      <div class="pannel-item">
        <span>场地金额：</span><span>¥{{ (details.resources_total_price - details.subsidy_fee)/100 | twoPoint }}</span>
      </div>
      <div class="pannel-item" v-if="details.deposit>0">
        <span>押金：</span><span>¥{{ details.deposit | twoPoint }}</span>
      </div>
      <div class="pannel-item" v-if="details.deducted>0">
        <span>使用积分抵扣：</span><span>-¥{{ details.deducted | twoPoint }}</span>
      </div>
      <div class="pannel-item">
        <span>实付金额：</span><span class="red"><i class="price-pre">¥</i><i class="price-num">{{ ( (details.resources_total_price - details.subsidy_fee)/100 - details.deducted + details.deposit*1 ) | twoPointPre }}.</i><i class="price-next">{{ ( (details.resources_total_price - details.subsidy_fee)/100 - details.deducted + details.deposit*1 ) | twoPointNext }}</i></span>
      </div>
    </div>
    <div class="bottom-btn">
      <div class="cancel-order" @click.stop="deleteOrder(details.order_id)">取消订单</div>
      <div class="pay-now" @click.stop="goPaid(details)">立即支付</div>

    </div>
    <div v-transfer-dom>
      <confirm
        v-model="queryModel"
        :close-on-confirm="false"
        title="是否删除订单?"
        @on-confirm="onConfirm">
      </confirm>
    </div>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead' ;
  import { getOrdersDetail ,deleteOrder } from 'src/service/getData';
  import { twoPoint , small , twoPointPre , twoPointNext , payModel} from 'src/filters/index';
  import { Confirm, TransferDomDirective as TransferDom } from 'vux';
  import { setSession } from 'src/config/tools';
  import { mapMutations } from 'vuex' ;
export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      details : null ,
      queryModel : false ,
      deleteOrderId : '' ,// 要删除的订单id
      group : false , // 是否为拼团订单
    }
  },
  components : {
    vHead,Confirm
  },
  created(){
    this.$vux.loading.show({
      text : 'loading...'
    });
    this.group = this.$route.query.group || false ;
  },
  filters : { twoPoint , small , twoPointPre , twoPointNext , payModel},
  mounted(){
    let id = this.$route.params.id ;
    getOrdersDetail(id).then(res => {
      this.details = res.result ;
      let id = this.details.resources[0].group_purchase_id ;
      if(id||id==0){
        this.group = true ;
      }
      this.$vux.loading.hide();
    }).catch(err => {
      this.$vux.toast.text(err.msg);
      this.$vux.loading.hide();
      this.$router.push('/myOrder');
    });
  },
  methods:{
    ...mapMutations(['RECORD_PAYMENTMODEL']),
    onConfirm(){
      let id = this.deleteOrderId ;
      this.queryModel = false ;
      deleteOrder(id).then(res => {
        this.$vux.toast.text('删除成功');
        this.$router.push('/myOrder');
      }).catch(err => {
        this.$vux.toast.text(err.msg);

      })
    },
    deleteOrder(id){
      this.queryModel = true ;
      this.deleteOrderId = id ;
    },
    goPaid(detail){
      // 跳转到选择支付方式页面
      let obj = {
        price : detail.actual_fee /100 ,
        type : 'order' ,
        order_id : detail.order_id
      };
      if(this.group){
        obj.group = true ;
      }
      this.RECORD_PAYMENTMODEL(obj);
      setSession('paymentModel' ,obj );
      this.$router.replace('/payment');
    },
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .orderDetail-wraper{
    .pay-info{
      height: 2rem;
      padding: 0.3rem 0.24rem ;
      color: #fff;
      @include bg-image( '../../images/bg_pending payment' );
      .status{
        font-size: 0.32rem;
      }
      .text{
        margin-top: 0.2rem;
        font-size: 0.24rem;
      }
      .time{
        margin-top: 0.15rem;
        font-size: 0.24rem;
        .day{
          margin-right: 0.2rem;
        }
      }
    }
    .order-info{
      margin-top: 0.2rem;
      font-size: 0.28rem;
      background-color: #fff;
      .order-id{
        padding: 0 0.24rem;
        line-height: 0.9rem;
        border-bottom: 1px solid rgba(0,0,0,0.1);
      }
      .contract{
        padding: 0 0.24rem;
        line-height: 0.9rem;
        color: #1e1e1e;
        .contract-people{
          margin-right: 0.6rem;
        }
      }
    }
    .list {
      overflow: hidden;
      .item {
        margin-top: 0.2rem;
        background-color: #fff;
        display: block;
        .title {
          padding: 0 0.24rem;
          line-height: 0.9rem;
          font-size: 0.24rem;
          font-weight: bold;
          background-color: #fff;
        }
        .content {
          display: flex;
          padding: 0.2rem 0.24rem;
          background-color: #F1F2F7;
          .img-box {
            margin-right: 0.2rem;
            > img {
              @include wh(1.36rem, 1.36rem);
            }
          }
          .norms {
            width: 3.76rem;
            margin-right: 0.2rem;
            .time {
              margin-top: 0.1rem;
              font-size: 0.24rem;
              color: $fontColor;
            }
            .norm {
              margin-top: 0.18rem;
              font-size: 0.22rem;
              color: #999;
            }
            .customs {
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
          .price-box {
            width: 1.46rem;
            text-align: right;
            font-size: 0.24rem;
            .discount-price {
              margin-top: 0.54rem;
              color: $fontColor;
            }
            .original-price {
              display: block;
              margin-top: 0.18rem;
              color: #999;
            }
          }
        }
        .other-info {
          padding: 0 0.24rem 0.15rem;
          background-color: #F1F2F7;
          .box {
            padding-top: 0.15rem;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            .second-info {
              margin-top: 0.12rem;
            }
            .info-left {
              font-size: 0.22rem;
              color: #999;
            }
            .info-right {
              font-size: 0.22rem;
              color: #000;
            }
          }

        }
        .price {
          padding: 0 0.24rem;
          line-height: 0.84rem;
          text-align: right;
          background-color: #fff;
          .price-pre {
            font-size: 0.22rem;
            color: #000;
          }
          .price-num {
            font-size: 0.28rem;
            color: #000;
          }
          .price-next {
            margin-right: 0.1rem;
            font-size: 0.22rem;
            color: #000;
          }
          .deposit {
            font-size: 0.22rem;
            color: #999;
          }
        }
      }
    }
    .submit-pannel{
      margin: 0.2rem 0 0.98rem;
      padding: 0 0.24rem;
      background-color: #fff;
      .pannel-item{
        display: flex;
        justify-content: space-between;
        line-height: 1rem;
        border-bottom: 1px solid #e8e8e8;
        font-size: 0.28rem;
        .red{
          font-size: 0.3rem;
          color: $red;
          .price-pre{
            margin-right: 0.1rem;
            font-size: 0.22rem;
          }
          .price-num{
            font-size: 0.3rem;
          }
          .price-next{
            font-size: 0.22rem;
          }
        }
        &:last-child{
          border-bottom: 0 none;
        }
      }
    }
    .bottom-btn{
      position: fixed;
      bottom: 0;
      left: 0;
      @include wh( 100% , 0.98rem );
      line-height: 0.98rem;
      display: flex;
      text-align: center;
      color: #fff;
      font-size: 0.34rem;
      .cancel-order{
        flex: 1;
        background-color: $mainColor;
      }
      .pay-now{
        flex: 1;
        background-color: $orange;
      }
    }
  }

</style>
