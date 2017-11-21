<template lang="html">
  <div>
    <div class="mask" @click="back"></div>
    <app-head isFixed="true">
      <div slot="center-part">提交成功</div>
    </app-head>
    <div class="box">
        <div class="bg-img"></div>
        <h3>需求提交成功</h3>
        <p>稍后工作人员将联系你</p>
    </div>
    <div class="btn-box">
      <div class="btn go-mydemand">
        <router-link to="/appMyDemand" @click="viewDemand">查看需求</router-link>
      </div>
      <div class="btn go-home" @click="back">
        <span>返回首页</span>
      </div>
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
import appHead from 'src/components/appHead';
export default {
  data () {
    return {

    }
  },
  components: {
    appHead
  },
  methods:{
    viewDemand(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('viewDemand', "查看需求" , function (data) {}) ;
      });
    },
    back(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('back_home', "返回首页" , function (data) {}) ;
      });
    }
  }
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
    .mask{
      position: fixed;
      top: 0.44rem;
      left: 0.15rem;
      width: 0.8rem;
      height: 0.9rem;
      z-index: 150;
    }
    .box {
        .bg-img{
          @include wh(2.02rem,2.02rem);
          margin:0.44rem auto 0.26rem;
          @include bg-image( '../../images/ic_Submit_successfully');
        }
        h3{
          font-size: 0.36rem;
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
          >span{
            color:#fff;
          }
        }
      }

    }

</style>
