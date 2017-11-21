<template lang="html">
  <div>
    <app-head isFixed="true">
      <div slot="center-part">特色主题展</div>
    </app-head>
    <div class="masks" @click="back"></div>
    <section class="thematic-list" v-if="articles.length">
      <div v-for="(item,index) in articles" :key="index">
        <a href="item.origin" class="item-link" v-if="item.origin">
          <img v-lazy="item.pic_url" alt="a">
          <div class="tit ellipsis">{{ item.digest }}</div>
        </a>
        <router-link class="item-link" to="{ path : '/appArticle' , params : { id : item.id } }" v-else>
          <img v-lazy="item.pic_url" alt="a">
          <div class="tit ellipsis">{{ item.digest }}</div>
        </router-link>
      </div>

    </section>
    <section class="no-data" v-else>暂无数据</section>
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
  import appHead from 'src/components/appHead.vue';
  import { getThemenShow } from 'src/service/getData';
export default {
  data () {
    return {
      page : 1 ,
      pageSize : 10 ,
      articles : [] ,
    }
  },
  components:{
    appHead
  },
  mounted(){
    let p = {
      page : this.page ,
      pageSize : this.pageSize ,
      position : 'theme'
    };
    getThemenShow( p ).then(res => {
      this.articles = res.result ;
    })
  },
  methods:{
    back(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('back_home', "返回首页" , function (data) {}) ;
      });
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .masks{
    position: fixed;
    top: 0.44rem;
    left: 0.15rem;
    width: 0.8rem;
    height: 0.9rem;
    z-index: 150;
  }
  .thematic-list{
    padding: 0.24rem 0.24rem 0;
    background-color: #fff;
    .item-link{
      display: block;
      img{
        @include wh(100%,3.9rem);
      }
      .tit{
        line-height: 0.7rem;
        border-bottom: 1px solid #e8e8e8;
        margin-bottom: 0.2rem;
        font-size: 0.3rem;
        color: $fontColor;
      }
      &:last-child{
        .tit{
          border-bottom: 0 none;
        }
      }
    }
  }
  .no-data{
    margin: 0.4rem  0;
    text-align: center;
    @include sc(0.28rem,#999);
  }
</style>
