<template lang="html">
  <div class="wraper">
    <v-head isFixed="true" goBack="true">
      <div slot="center-part">提交订单</div>
    </v-head>
    <div class="contract" v-if="defaultContract">
      <router-link to="/address">
        <span>联系人：</span><span class="contract-people">{{ defaultContract.name }}</span>联系方式：<span>{{ defaultContract.mobile }}</span>
        <span class="right"></span>
      </router-link>

    </div>

    <tips><div slot="text">若需开发票，订单审核通过后请在【我的票据】中补开。</div></tips>
    <div class="other-demand">
      <div class="common-desc">
        <p class="title">其他需求</p>
        <p class="desc">需要额外付费，订单支付成功后工作人员会跟您联系。</p>
      </div>
      <div class="server">
        <span>需要布置</span>
        <x-switch title="" v-model="need_decoration"></x-switch>
      </div>
      <div class="server">
        <span>需要运输</span>
        <x-switch title="" v-model="need_transportation"></x-switch>
      </div>
      <div class="server">
        <span>需要兼职</span>
        <x-switch title="" v-model="delegated"></x-switch>
      </div>
    </div>
    <div class="integral">
      <div>
        <span class="integral-tit">积分</span><router-link to="/article/65?page=help"><i class="integral-info">{{ integralInfo }}</i><i class="query-icon"></i></router-link>
      </div>
      <x-switch title="" v-model="integral" :disabled="is_integral"></x-switch>
    </div>
    <div class="list">

      <div class="order-item" v-for="(item ,index) in viewList" :key="index">
        <div class="order-content">
          <div class="img-box">
            <img :src="item.pic_url" alt="a">
            <span class="position" v-if="item.field_type">{{ item.field_type }}</span>
          </div>
          <div class="norms">
            <div class="name ellipsis">{{ item.name }}</div>
            <div class="time">时间：<span>{{ item.date }}</span></div>
            <div class="norm">规格：<span>{{ item.size }}({{ item.lease_term_type_name }})</span></div>
            <div class="custom">{{ item.custom_dimension }}</div>
            <div class="price" v-if="item.discount_price">
              <span class="price-pre">¥</span><span class="price-num">{{ (item.price-item.discount_price)/100 | twoPointPre }}.</span><span class="price-next">{{ (item.price-item.discount_price)/100 | twoPointNext }}</span>
              <del >¥{{ item.price/100 }}</del>
            </div>
            <div class="price" v-else>
              <span class="price-pre">¥</span><span class="price-num">{{ item.price/100 | twoPointPre }}.</span><span class="price-next">{{ item.price/100 | twoPointNext }}</span>
            </div>
          </div>
        </div>
        <div class="leave-words">
          <span class="leave-tit">留言：</span>
          <textarea class="words" placeholder="选填，给物业留言(最大32字)" v-model="item.leaveWorld" maxlength="32"></textarea>
        </div>
      </div>

    </div>
    <div class="submit-pannel">
      <div class="pannel-item">
        <span>场地金额：</span><span>¥{{ total_price/100 }}</span>
      </div>
      <div class="pannel-item">
        <span>押金：</span><span>¥{{ deposit }}</span>
      </div>
      <div class="pannel-item">
        <span>使用积分抵扣：</span><span>-¥{{ integralPriceView }}</span>
      </div>
      <div class="last-item pannel-item">
        <span class="pay-text">实付款：</span><span class="red"><i class="price-pre">¥</i><i class="price-num">{{ (total_price/100 + deposit - integralPriceView) | twoPointPre}}.</i><i class="price-next">{{ (total_price/100 + deposit - integralPriceView) | twoPointNext }}</i></span>
      </div>
    </div>
    <div class="submit-order" @click.stop="submitOrder">提交订单</div>
    <div v-transfer-dom>
      <x-dialog v-model="showInfo" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: 'auto', 'background-color': 'transparent'}">
        <div class="model">
          <p>您还未填写公司信息</p>
          <p>请完善公司信息以便物业审核您的订单!</p>
          <router-link class="btn" to="/company">去完善</router-link>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead' ;
  import tips from 'src/components/tips' ;
  import { XSwitch,XDialog ,TransferDomDirective as TransferDom } from 'vux'
  import { half , twoPointPre , twoPointNext , large } from 'src/filters';
  import { getDefaultAddress , getUserStatus , buildOrder } from 'src/service/getData';
  import { getSession , removeSession , setSession } from 'src/config/tools';
  import { mapMutations } from 'vuex' ;
export default {
  data () {
    return {
      ticket_type : 1 , // 1 收据  2 发票  3 专票
      total_price : 0 , // 总价（分）
      need_decoration : false, // 是否需要布置(0:否 1:是)
      need_transportation : false , // 是否需要运输(0:否 1:是)
      delegated : false , // 是否托管执行
      integral : false , // 积分
      mobile : '' , // 手机号
      contact : '' , // 联系人
      address : '' , // 地址
      defaultContract : null , // 默认联系人信息
      orderList : [] , // 订单行
      viewList : [] , // 展示订单行
      showInfo: false , // 公司信息完善弹窗
      infoFlag : true ,  // 公司信息的完善度 true 表示完善

      deposit : 0 , // 押金
      jifen : 0 , // 用户积分
      is_integral : false , // 不禁用积分
      integralInfo : '使用条件不足，无法使用。' ,
      point : 0 , // 使用的积分数
      integralPrice : 0 , // 积分抵扣的钱
      integralPriceView : 0 , // 积分抵扣的钱
      group : false , // 是否拼团订单
    }
  },
  filters : {
    half , twoPointPre , twoPointNext , large
  },
  components : {
    vHead,XSwitch,XDialog,tips
  },
  directives: {
    TransferDom
  },
  mounted(){
    // 获取下单的数据
    let data = getSession('orderResource') || null ;

    if(!data){
      this.$router.push('/home');
      return false;
    }
    this.viewList = data.resource ;
    this.group = data.group ;

    // 获取默认联系人信息
    getDefaultAddress().then( res => {
      this.defaultContract = res.result ;
      this.mobile = this.defaultContract.mobile ;
      this.contact = this.defaultContract.name ;
      this.address = this.defaultContract.address ;
    });

    // 获取用户的积分
    let userInfo = getSession('userInfo');
    this.jifen = userInfo.consumption_point ;
    // 计算总金额
    this.amountTotalPrice(this.viewList)  ;
    // 计算总的押金
    this.amountTotalDeposit(this.viewList);
    // 判断积分规则
    this.integralRule(this.total_price);

    // 判断公司信息的完善度
    this.rullerCompanyInfo();
  },
  methods : {
    ...mapMutations([
      'RECORD_PAYMENTMODEL'
    ]),
    amountTotalPrice(data){
      for(let item of data){
        this.total_price += (item.price-item.discount_price) ;
      }
    },
    amountTotalDeposit(data){
      let obj = {};
      let arr = [];
      for(let item of data){
        obj[item.id] ? '' : obj[item.id] = true && arr.push(item) ;
      }
      for(let v of arr){
        this.deposit += parseInt( v.deposit );
      }
    },
    integralRule( totalprice ){
      if(totalprice < 100){// 订单金额小于100元不能使用积分
        this.is_integral = true ;
        this.integralPrice = 0 ;
        this.point = 0 ;
        this.integralInfo = "订单总金额小于100元，不能使用积分!" ;
      }else{
        if(this.jifen < 1000){
          this.is_integral = true ;
          this.point = 0 ;
          this.integralPrice = 0 ;
          this.integralInfo = "积分不足!" ;
          return false;
        }else if(this.jifen >= 1000 && this.jifen<=10000) {
          this.point = Math.floor(this.jifen / 1000) * 1000;
          this.integralPrice = Math.floor(this.jifen / 1000) * 5;
          this.integralInfo = "本次可用"+this.point+"积分抵扣"+this.integralPrice+"元。";
          return false;
        }else if(this.jifen > 10000) {
          this.point = 10000 ;
          this.integralPrice = 50 ;
          this.integralInfo = "本次可用10000积分抵扣50元";
          return false;
        }
      }
    },
    rullerCompanyInfo(){
      // 公司信息的完成度
      getUserStatus().then( res => {
        let status = res.result.complete_status ;
        if( !status ){
          this.showInfo = true ;
          this.infoFlag = false ;
          return false ;
        }else{
          this.infoFlag = true ;
        }
      })
    },
    submitOrder(){
      if(this.infoFlag){
        for(let item of this.viewList){
          let obj = {};
          obj.id = +item.id ;
          obj.size = item.size ;
          obj.lease_term_type_id = item.lease_term_type_id ;
          obj.count = item.count ;
          obj.count_of_time_unit = item.count_of_time_unit ;
          obj.custom_dimension = item.custom_dimension ;
          obj.date = item.date ;
          obj.leave_words = item.leaveWorld ;
          this.orderList.push(obj);
        }

        let params = {
          total_actual_price : (this.total_price/100 + this.deposit - this.integralPriceView )*100,
          delegated : +this.delegated ,
          ticket_type : this.ticket_type ,
          need_decoration : +this.need_decoration ,
          need_transportation : +this.need_transportation ,
          contact : this.contact ,
          mobile : this.mobile ,
          address : this.address ,
          point : this.point ,
          resources : JSON.stringify(this.orderList)
        };
        if(!this.integral){
          params.point = 0 ;
        }

        buildOrder(params).then( res => {
          // 清除session中保存的订单信息
          removeSession('orderResource');

          // 跳转到选择支付方式页面
          let obj = {
            price : this.total_price/100 + this.deposit - this.integralPriceView ,
            type : 'order' ,
            order_id : res.result.order_id
          };
          if( this.group ){
            obj.group = true ;
          }
          this.RECORD_PAYMENTMODEL(obj);
          setSession('paymentModel' ,obj );
          this.$router.replace('/payment');

        }).catch(err => {
          this.$vux.toast.text(err , 'middle');
        });
      }else{
        this.showInfo = true ;
      }
    }
  },
  watch : {
    'integral' : function (newVal , oldVal){
      if(newVal){
        this.integralPriceView = this.integralPrice
      }else{
        this.integralPriceView = 0 ;
        this.point = 0 ;
      }
    },
    'viewList' : {
      handler : function (newVal , oldVal) {
        this.viewList = newVal ;
      },
      deep : true
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .wraper{
    background-color: $bgc;
  }
  .common-desc{
    height: 1.2rem;
    padding: 0.25rem 0.24rem 0.2rem;
    border-bottom: 1px solid #e8e8e8;
    background-color: #fff;
    .title{
      font-size: 0.28rem;
    }
    .desc{
      margin-top: 0.2rem;
      font-size: 0.24rem;
      color: #999;
    }
  }
  .contract{
    >a{
      display: block;
      color: #1e1e1e;
    }
    padding: 0 0.24rem;
    line-height: 1rem;
    color: #1e1e1e;
    background-color: #fff;
    .contract-people{
      margin-right: 0.6rem;
    }
    .right{
      @include wh( 0.44rem , 0.44rem );
      margin-top: 0.28rem;
      @include bg-image('../../images/ic_next');
    }
  }
  .other-demand{
    margin-top: 0.2rem;
    background-color: #fff;
    .server{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 0.9rem;
      margin: 0 0.24rem;
      border-bottom: 1px solid #e8e8e8;
      font-size: 0.26rem;
      &:last-child{
        border-bottom:0 none;
      }
    }
  }
  .integral{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.9rem;
    padding: 0 0.24rem;
    margin-top: 0.2rem;
    background-color: #fff;
    .integral-tit{
      margin-right: 0.2rem;
      font-size: 0.28rem;
    }
    .integral-info{
      font-size: 0.24rem;
      color: #999;
    }
    .query-icon{
      display: inline-block;
      vertical-align: middle;
      @include wh( 0.3rem ,0.3rem );
      @include bg-image('../../images/ic_prompt_one_two_four_one');
    }
  }
  .list{
    padding: 0 0.24rem;
    margin-top: 0.2rem;
    background-color: #fff;
    .order-item{
      padding: 0.2rem 0;
      border-bottom: 1px solid #E8E8E8;
      .order-content{
        display: flex;
        padding: 0.2rem 0;
        .img-box{
          position: relative;
          margin-right: 0.2rem;
          >img{
            @include wh( 2rem , 2rem );
          }
          .position{
            position: absolute;
            top: 0;
            left: 0.16rem;
            width: 0.42rem;
            max-height: 1.8rem ;
            overflow: hidden;
            padding: 0.06rem 0.1rem 0.1rem;
            background-color: $mainColor;
            border-radius: 0 0 0.21rem 0.21rem;
            font-size: 0.22rem;
            color: #fff;
          }
        }
        .norms{
          overflow: hidden;
          .name{
            margin-top: 0.1rem;
            font-size: 0.28rem;
            color: $fontColor;
          }
          .time{
            margin-top: 0.15rem;
            font-size: 0.22rem;
            color: #999;
          }
          .norm{
            margin-top: 0.1rem;
            font-size: 0.22rem;
            color: #999;
          }
          .custom{
            height: 0.24rem;
            margin-top: 0.1rem;
            font-size: 0.22rem;
            color: $mainColor;
          }
          .price{
            margin-top: 0.1rem;
            font-size: 0;
            .price-pre{
              font-size: 0.22rem;
              color: $red;
            }
            .price-num{
              font-size: 0.28rem;
              color: $red;
            }
            .price-next{
              margin-right: 0.15rem;
              font-size: 0.22rem;
              color: $red;
            }
            del{
              font-size: 0.22rem;
              color: #999;
            }
          }
        }
      }
      .leave-words{
        display: flex;
        padding: 0.1rem 0 0;
        .leave-tit{
          font-size: 0.24rem;
          color: $fontColor;
        }
        .words{
          width: 6.2rem;
          font-size: 0.24rem;
          color:  #3F3F3F;
        }
      }
      &:last-child{
        border-bottom: 0 none;
      }
    }
  }
  .submit-pannel{
    margin-top: 0.2rem;
    padding: 0 0.24rem 1rem;
    background-color: #fff;
    .pannel-item{
      display: flex;
      justify-content: space-between;
      line-height: 0.9rem;
      border-bottom: 1px solid #e8e8e8;
      font-size: 0.28rem;

    }
    .last-item{
      justify-content: flex-end;
      .pay-text{
        margin-right: 0.1rem;
        font-size: 0.24rem;
      }
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
    }
  }
  .submit-order{
    position: fixed;
    bottom: 0;
    left: 0;
    @include wh( 100% , 1rem );
    line-height: 1rem;
    text-align: center;
    font-size: 0.34rem;
    color: #fff;
    background-color: $orange;
  }
  .model{
    width: 5.6rem;
    margin: 0 auto;
    padding: 0.58rem 0.35rem 0.4rem;
    border-radius: 0.24rem;
    background-color: #fff;
    p{
      @include sc(0.28rem,#1e1e1e);
      line-height: 0.44rem;
    }
    .btn{
      display: block;
      @include wh(2.18rem,0.64rem);
      line-height: 0.64rem;
      margin: 0.4rem auto 0;
      text-align: center;
      @include sc(0.28rem,#fff);
      border-radius: 0.08rem;
      background-color: $mainColor;
    }
  }
</style>
