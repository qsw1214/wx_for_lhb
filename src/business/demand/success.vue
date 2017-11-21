<template lang="html">
  <div>
    <v-head go-back="true" isFixed="true">
      <div slot="center-part">提交成功</div>
    </v-head>
    <div class="box">
        <div class="bg-img"></div>
        <h3>需求提交成功</h3>
        <p>稍后工作人员将联系你</p>
    </div>
    <div class="btn-box">
      <div class="btn go-mydemand">
        <router-link to="/mydemand">查看需求</router-link>
      </div>
      <div class="btn go-home">
        <router-link to="/home">返回首页</router-link>
      </div>
    </div>

  </div>
</template>

<script>
import vHead from 'src/components/vHead';
export default {
  data () {
    return {

    }
  },
  components: {
    vHead
  },
}

</script>
<style lang="scss">
@import "../../style/mixin";
  body,html{
    height:100%;
    background:#fff;
  }
</style>
<style lang="scss" scoped>
    @import "../../style/mixin";
    .box {
        .bg-img{
          @include wh(2.02rem,2.02rem);
          margin:0.44rem auto 0.26rem;
          @include bg-image( '../../images/ic_Submit_successfully');
        }
        h3{
          font-size: .36rem;
          margin-bottom:0.2rem;
          text-align: center;
        }
        p{
          @include sc(0.26rem,#A9A9A9);
          text-align: center;
        }
    }
    .btn-box{
      margin-top:0.6rem;
      display: flex;
      justify-content: center;

      .btn{
        @include wh(2.36rem,0.64rem);
        margin:0 0.1rem;
         text-align: center;
         line-height:0.64rem;
        font-size: 0.28rem;
        border-radius:0.08rem;
        &.go-mydemand{
          border:1px solid #999;
        }
        &.go-home{
          background:$mainColor;
          >a{
            color:#fff;
          }
        }
      }

    }

</style>
