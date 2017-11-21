<template lang="html">
<!--场地列表单个组件-->
  <div class="v-field-list-item" v-show="field">
    <router-link :to="{ name : 'fieldsDetail' , params : { id : field.resource_id }  }" class="item-wraper">
      <div class="img-box">
        <img v-lazy="field.pic_url" :data-srcset="field.pic_url | half" :alt="field.resource_name">
        <span class="field-type-label">{{ field.field_type || field.ad_type }}</span>
      </div>
      <div class="field-text-content">
        <div class="title ellipsis">
          <span class="type-label" v-if="field.cooperation_type_id == 12"></span><span>{{ field.resource_name }}</span>
        </div>
        <div class="address ellipsis">{{field.district}}{{field.address}}</div>
        <div class="info ellipsis">
          <span>人流量:</span><span>{{ field.number_of_people || '' }}</span><span class="number-people">付款人数:</span><span>{{ field.order_count }}</span>
        </div>
        <div class="price-box ellipsis">
          <span class="price-label" v-if="field.subsidy_fee">惠</span><span class="price-pre">￥</span><span class="price">{{ (field.price - field.subsidy_fee)  / 100 | twoPointPre }}.</span><span class="price-next">{{ (field.price - field.subsidy_fee)  / 100 | twoPointNext }}</span>
          <span class="com-font">起</span><del v-if="field.subsidy_fee" class="com-font oringe-price">￥{{ field.price /100 }}</del>
        </div>

      </div>
    </router-link>
  </div>
</template>

<script>
  import { half , twoPointPre , twoPointNext } from 'src/filters';
export default {
  data () {
    return {

    }
  },
  props : [ 'field' ],
  filters : { half , twoPointPre , twoPointNext }
}

</script>

<style lang="scss" scoped>
  @import "../style/mixin";
  .com-font{
    font-size: 0.26rem;
    color: #999;
  }
  .v-field-list-item{
    padding: 0.24rem 0 0 0.24rem;
    background-color: #fff;
    .item-wraper{
      font-size: 0;
      display: flex;
      justify-content: space-between;
      .img-box{
        position: relative;
        width: 2rem;
        >img{
          width: 2rem;
          height: 2rem;
        }
        .field-type-label{
          position: absolute;
          top:0;
          left: 0.08rem;
          width: 0.32rem;
          max-height: 2rem;
          padding: 0.08rem 0 0.18rem;
          border-radius: 0 0 0.16rem 0.16rem;
          text-align: center;
          font-size: 0.24rem;
          color: #fff;
          background-color: #109ee7;
        }
      }
      .field-text-content{
        width: 4.98rem;
        margin-left: 0.24rem;
        padding:0 0.24rem 0.24rem 0;
        border-bottom: 1px solid #e8e8e8;
        font-size: 0;
        overflow: hidden;
        .title{
          .type-label{
            display: inline-block;
            vertical-align: top;
            @include wh( 0.48rem , 0.32rem );
            margin-right: 0.08rem;
            @include bg-image('../images/ic_self_support_one_normal_three');
          }
          font-size: 0.32rem;
          color: #282a2a;
        }
        .address{
          margin-top: 0.2rem;
          @extend .com-font ;
        }
        .info{
          margin-top: 0.28rem;
          @extend .com-font ;
          .number-people{
            margin-left:0.4rem;
          }
        }
        .price-box{
          margin-top: 0.23rem;
          .price-label{
            display: inline-block;
            vertical-align: top;
            @include wh( 0.32rem , 0.32rem );
            margin-right: 0.16rem;
            @include bg-image('../images/ic_subsidy_normal_three copy');
          }
          .price-pre{
            font-size: 0.28rem;
            color: $red;
          }
          .price{
            font-size: 0.36rem;
            color: $red;
            font-weight: bold;
          }
          .price-next{
            @extend .price-pre;
          }
          .oringe-price{
            margin-left: 0.08rem;
          }
        }
      }
    }
  }

</style>
