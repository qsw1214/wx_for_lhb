<template lang="html">
  <div class="cart-wraper">
    <v-head go-back="true" isFixed="true">
      <div slot="center-part">购物车({{cartList.length}})</div>
      <div slot="right-part" class="rt" v-if="selectedNum">
        <span class="clear-cart" @click.stop="queryModel=true"></span>
      </div>
    </v-head>

    <div class="submit-table" v-if="cartList.length">
      <tips><div slot="text">提示：广告类订单请在APP上查看</div></tips>
      <div class="cart-item" v-for="(item,index) in cartList" :key="index">

        <div class="checked" v-if="item.valid">
          <input class="checkbox" type="checkbox" v-model="item.is_selected" @click.stop="cartItemClick(item)">
        </div>
        <div class="checked" v-else>
          <span class="valid-btn">失效</span>
        </div>
        <router-link :to="{ name : item.res_type_id == 1 ? 'fieldsDetail' : 'activitiesDetail' , params : {id : item.resource_id} }" class="cart-link" :class="{ valid : !item.valid }">
          <div class="img-box">
            <img v-lazy="item.pic_url" :data-srcset="item.pic_url | half" alt="a">
            <div v-if="item.res_type_id==1" class="position">{{ item.field_type }}</div>
            <div v-else-if="item.res_type_id==3" class="position">{{ item.activity_type }}</div>
          </div>
          <div class="norms">
            <div class="tit ellipsis">{{ item.name }}</div>
            <div class="time"><span>时间：</span><span>{{ item.date }}</span></div>
            <div class="size"><span>规格：</span><span>{{ item.size }}</span> <span>{{ item.lease_term_type }}</span></div>
            <div class="custom">{{ item.custom_dimension }}</div>
            <div class="real-paid" v-if="item.subsidy_fee>0">
              <span class="price-pre">¥</span><span class="price-num">{{ (item.price - item.subsidy_fee)/100 }}</span>
              <del class="origin-price"><span>¥</span><span>{{ item.price/100 }}</span></del>
            </div>
            <div class="real-paid" v-else>
              <span class="price-pre">¥</span><span class="price-num">{{ item.price/100 }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="no-data" v-else>
       <img src="../../images/icon-fail.png" alt="a" class="info-icon">
       <p class="tit">购物车里空空如也</p>
       <router-link to="/home" class="go-home">快去首页逛逛吧</router-link>
    </div>
    <div class="remove-disabled" v-if="hasUnValid" @click.stop="removeDisabled">移除失效商品</div>
    <div class="bottom-fence">
      <div class="price">
        <div>
          <input class="checkbox all" type="checkbox" v-model="allchecked" @click.stop="allcheck"><span>全选</span>
        </div>
        <div class="price-box">
          <span class="hj">合计：</span><span class="price-pre">¥</span><span class="price-num">{{ totalPrice/100 | twoPointPre }}.</span><span class="price-next">{{ totalPrice/100 | twoPointNext }}</span>
        </div>

      </div>
      <div class="submit-btn" @click.stop="submit">结算({{selectedNum}})</div>
    </div>
    <div v-transfer-dom>
      <confirm
      v-model="queryModel"
      :close-on-confirm="false"
      title="确定移除所选商品吗？"
      @on-confirm="onConfirm">
      </confirm>
    </div>
    <v-footer :threeselected="true"></v-footer>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead'
  import tips from 'src/components/tips'
  import vFooter from 'src/components/vFooter'
  import { half , twoPointPre , twoPointNext , large } from 'src/filters'
  import { Confirm, TransferDomDirective as TransferDom } from 'vux'
  import { getCartList , removeCartList } from 'src/service/getData'
  import { getStorage , setStorage , getStyle , getSession , setSession } from 'src/config/tools'
export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      hasSelected : true,
      allchecked : false , // 全选按钮
      cartList : [] , // 购物车列表
      totalPrice : 0 , // 总额
      selectedNum : 0 , // 选择的商品数量
      queryModel : false,
      hasUnValid : false ,
    }
  },
  components : {
    vHead,
    vFooter,
    Confirm,tips
  },
  mounted(){
    getCartList().then( res => {
      let temp = res.result ;
      let noAd = [] ;
      for(let item of temp){
        // 过滤掉广告
        if(item.res_type_id != 2){
          Object.assign(item , { is_selected : false });
          if(!item.valid){
            this.hasUnValid = true ;
          }
          noAd.push(item);
        }
      }
      this.cartList =  noAd ;
    })
  },
  filters : {
    half , twoPointPre , twoPointNext , large
  },
  methods : {
    onConfirm(){
      let arr = [] ;
      for(let item of this.cartList) {
        if (item.valid && item.is_selected) {
          arr.push( item.shopping_cart_item_id );
        }
      }
      let params = {
        cart_item_ids : JSON.stringify(arr)
      };
      this.queryModel = false ; // 隐藏弹窗
      removeCartList(params).then(res => {
        this.$vux.toast.show({
          text : '成功移除',
          type : 'success',
          width : '25%'
        });
        this.$router.go(0);
      }).catch( err => {
        this.$vux.toast.show({
          text : '移除失败',
          type : 'warn',
          width : '25%'
        })
      })
    },
    submit(){
      let ids = [] ;
      let arr = [] ;
      for(let item of this.cartList){
        if(item.valid && item.is_selected){
          let obj = {
            id : item.resource_id ,
            size : item.size ,
            lease_term_type_id : item.lease_term_type_id,
            count : item.count,
            count_of_time_unit : item.count_of_time_unit,
            custom_dimension : item.custom_dimension,
            date : item.date,
            lease_term_type_name : item.lease_term_type,
            name : item.name,
            pic_url : item.pic_url,
            discount_price : item.subsidy_fee,
            field_type : item.res_type_id == 1 ? item.field_type : item.res_type_id == 3 ? item.ad_type : '活动' ,
            price : item.price,
            deposit : item.deposit,
            leaveWorld : '', // 留言
          };
          arr.push(obj);
          ids.push( item.shopping_cart_item_id );
        }
      }
      if( !arr.length || !ids.length ){
        this.$vux.toast.text('请选择你要结算的商品' , 'middle');
        return false ;
      }

      setSession('orderResource',{ resource : arr , cart_item_ids : ids });
      this.$router.push('/submitOrder');
    },
    countPrice(){
      let sum = 0 ;
      let selected = 0 ;
      for(let item of this.cartList) {
        if (item.valid && item.is_selected) {
          sum += (item.price - item.subsidy_fee) ;
          selected++
        }
      }
      this.totalPrice = sum ;
      this.selectedNum = selected ;
    },
    allcheck(){
      if(this.allchecked){
        for(let item of this.cartList){
          if(item.valid){
            item.is_selected = true ;
          }
        }
      }else{
        for(let item of this.cartList){
          if(item.valid){
            item.is_selected = false ;
          }
        }
      }
      this.countPrice();
    },
    cartItemClick(item){
      if(item.is_selected){
        let flag = true ;
        for(let t of this.cartList){
          if(!t.is_selected){
            flag = false ;
          }
        }
        if(flag){
          this.allchecked = true ;
        }
      }else{
        this.allchecked = false ;
      }
      this.countPrice();
    },
    removeDisabled(){
      let arr = [] ;
      for(let item of this.cartList) {
        if ( !item.valid ) {
          arr.push( item.shopping_cart_item_id );
        }
      }
      if(arr.length){
        let params = {
          cart_item_ids : JSON.stringify(arr)
        };
        removeCartList(params).then( res => {
          this.$vux.toast.show({
            text : '成功移除',
            type : 'success',
            width : '25%'
          });
          this.$router.go(0);
        }).catch( err => {
          this.$vux.toast.show({
            text : '移除失败',
            type : 'warn',
            width : '25%'
          })
        })
      }

    }
  }
}

</script>
<style lang="scss">
  @import "../../style/mixin";
  .weui-icon-success{
    font-size: 0.42rem !important;
  }
  .weui_icon_circle{
    font-size: 0.42rem !important;
  }
  .vux-check-icon > span{
    margin-left: 0.15rem;
    color: #666 !important;
    font-size: 0.3rem;
  }
</style>
<style lang="scss" scoped>
  @import "../../style/mixin";
  .clear-cart{
    display: inline-block;
    vertical-align: middle;
    @include wh( 0.36rem , 0.4rem );
    @include bg-image( '../../images/ic_delete' );
  }
  .checkbox{
    display: inline-block;
    @include wh(0.42rem,0.42rem);
    @include bg-image('../../images/ic_chose1_nor_three');
    &.all{
      @include wh(0.46rem,0.46rem);
      margin-right: 0.2rem;
      vertical-align: middle;
    }
    &:checked{
      @include bg-image('../../images/ic_chose1_press_three');
    }
  }
  .cart-wraper{
    background-color: $bgc;
  }
  .submit-table{
    margin-bottom: 2rem;
    background-color: #fff;
    .cart-item{
      display: flex;
      padding: 0.24rem 0;
      .checked {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 0.42rem;
          margin: 0 0.33rem;
          .valid-btn {
            display: inline-block;
            text-align: center;
            height: 0.28rem;
            line-height: 0.28rem;
            font-size: 0.18rem;
            border-radius: 0.04rem;
            color: #fff;
            background-color: #bbb;
          }
        }
      .cart-link {
        display: flex;
        .img-box {
          @include wh(2rem, 2rem);
          margin-right: 0.2rem;
          position: relative;
          > img {
            @include wh(100%, 2rem);
          }
          .position {
            position: absolute;
            top: 0;
            left: 0.16rem;
            width: 0.42rem;
            padding: 0.06rem 0.1rem 0.1rem;
            background-color: $mainColor;
            border-radius: 0 0 0.21rem 0.21rem;
            font-size: 0.22rem;
            color: #fff;
          }
        }
        .norms {
          position: relative;
          width: 4.22rem;
          padding-right: 0.24rem;
          &:after {
            content: '';
            position: absolute;
            bottom: -0.24rem;
            right: 0;
            @include wh(4.22rem, 1px);
            background-color: #e8e8e8;
          }
          .tit {
            margin-top: 0.1rem;
            font-size: 0.28rem;
            color: $fontColor;
          }
          .time {
            margin-top: 0.18rem;
            font-size: 0.22rem;
            color: #999;
          }
          .size {
            margin-top: 0.1rem;
            font-size: 0.22rem;
            color: #999;
          }
          .custom {
            height: 0.24rem;
            margin-top: 0.1rem;
            font-size: 0.22rem;
            color: $mainColor;
          }
          .real-paid {
            margin-top: 0.15rem;
            .price-pre {
              font-size: 0.22rem;
              color: $red;
            }
            .price-num {
              font-size: 0.28rem;
              color: $red;
            }
            .origin-price {
              font-size: 0.22rem;
              color: #999;
            }
          }
        }
        &.valid {
          .norms {
            .tit {
              color: #999;
            }
            .custom {
              color: #999;
            }
            .real-paid {
              .price-pre {
                color: #999;
              }
              .price-num {
                color: #999;
              }
            }
          }

        }
      }
    }

  }
  .no-data{
    padding-top: 0.9rem;
    text-align: center;
    margin-bottom: 2rem;
    .info-icon{
      @include wh(1.36rem,1.36rem);
      margin: 0 auto;
    }
    .tit{
      margin-top: 0.3rem;
      font-size: 0.32rem;
      color: $fontColor;
    }
    .go-home{
      display: block;
      margin-top: 0.3rem;
      @include sc(0.24rem,#999);
    }
  }
  .bottom-fence{
    position: fixed;
    bottom: 1rem;
    left: 0;
    display: flex;
    justify-content: space-between;
    @include wh( 100% , 1rem );
    line-height: 1rem;
    .price{
      display: flex;
      justify-content: space-between;
      width: 5.1rem;
      padding:0 0.2rem 0 0.3rem;
      background-color: #fff;
      .price-box{
        .hj{
          font-size: 0.24rem;
          color: $fontColor;
        }
        .price-pre{
          @include sc( 0.22rem , $red );
        }
        .price-num{
          @include sc( 0.3rem , $red );
        }
        .price-next{
          @include sc( 0.24rem , $red );
        }
      }
    }
    .submit-btn{
      width: 2.4rem;
      font-size: 0.34rem;
      color: #fff;
      text-align: center;
      background-color: $orange;
    }
  }
  .remove-disabled{
    @include wh(2rem ,0.72rem);
    margin: 0 auto 2.2rem;
    line-height: 0.72rem;
    border:1px solid #ccc;
    color: $fontColor;
    font-size: 0.24rem;
    text-align: center;
  }
</style>
