<template>
  <div>

    <div class="header border-1px" :class="{ fixed : isFixed , blue : blue }">
      <div class="app-fill"></div>
      <flexbox :gutter="0">
        <flexbox-item :span="3">
          <!--返回上一页-->
          <div class="backIcon" v-if="goBack" @click="goBackOne"></div>
          <div class="back" v-else>

              <div class="backIcon"></div>

          </div>
        </flexbox-item>
        <flexbox-item :span="6">
          <div class="ct">
            <slot name="center-part">需求详情</slot>
          </div>
        </flexbox-item>
        <flexbox-item :span="3">
          <slot name="right-part"></slot>
        </flexbox-item>
      </flexbox>
    </div>
    <div class="fill" v-if="isFixed"></div>
  </div>
</template>

<script>

  import { Flexbox , FlexboxItem } from 'vux'
  export default {
    data () {
      return {
        n : 0
      }
    },
    props : [ 'isFixed' , 'path' , 'blue' , 'goBack' ] ,
    components : {
      Flexbox,
      FlexboxItem
    },
    methods:{
      goBackOne(){
        this.$router.go(-1);
        return false ;
      }

    }

  }
</script>

<style lang="scss" scoped>
  @import '../style/mixin' ;

  .header {
    position: relative;
    @include wh( 100% , 1.34rem );
    padding: 0 0.28rem;
    line-height: 0.9rem;
    background-color: $white;
    border-bottom: 1px solid #e8e8e8;
    &.blue{
      background-color: $mainColor;
      border-bottom: 0 none;
      .backIcon{
        @include wh( 0.48rem , 0.48rem );
        @include bg-image("../images/nav_ic_back_white");
      }
      .ct{
        line-height: 0.9rem;
        color: #fff;
      }
    }
    &.fixed {
      position: fixed;
      top:0;
      left: 0;
      z-index: 10;
    }
    .app-fill{
      width: 100%;
      height: 0.44rem;
    }
    .backIcon {
      @include wh( 0.48rem , 0.48rem );
      @include bg-image("../images/ic_back_black");
    }
    .back {
      a {
        display: inline-block;
        vertical-align: middle;
        width: 1rem;
      }
    }
    .ct {
      line-height: 0.9rem;
      font-size: 0.36rem;
    }
  }
  .fill {
    @include wh( 100% , 1.34rem );
    background-color: transparent;
  }
</style>
