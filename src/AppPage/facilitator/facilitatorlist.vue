<template lang="html">
  <div>
    <div class="mask" @click="back"></div>
    <app-head isFixed="true">
      <div slot="center-part">优选服务商</div>
    </app-head>
    <div class="list" v-load-more="loadingMore">
      <div class="facilitator-item" v-for="(item,index) in facilitatorList" :key="index">
        <router-link :to="{ name : 'appFacilitatorDetail', params : { id :item.id },query : { city_id : $route.query.city_id } }" class="facilitator-link">
          <img v-lazy="item.pic_url" alt="服务商主题图片">
          <div class="title">{{ item.company }}</div>
        </router-link>
        <div class="contact">
          <div class="address">
            <p>联系电话：<span>{{ item.mobile }}</span></p>
            <p>地址：<span>{{ item.office_location }}</span></p>
          </div>
          <div class="consult">
            <span @click="telUs(item.mobile)">
              <i class="consult-icon"></i><span>咨询</span>
            </span>
          </div>
        </div>
        <div class="server-project">
          <span class="pro-item" v-if="item.design_and_build">设计搭建</span>
          <span class="pro-item" v-if="item.part_time_service">兼职服务</span>
          <span class="pro-item" v-if="item.material_transportation">物料运输</span>
          <span class="pro-item" v-if="item.push_execution">地推执行</span>
        </div>
      </div>

      <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
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
  import { getFacilitatorList } from 'src/service/getData';
  import { LoadMore } from 'vux';
  import { loadMore } from 'src/components/mixin';
export default {
  data () {
    return {
      facilitatorList: [], // 列表数组
      page : 1,
      pageSize : 10,
      city_id : 90,

      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,
    }
  },
  mixins : [ loadMore ] ,
  components : {
    appHead, LoadMore
  },
  created(){
    this.city_id =  this.$route.query.city_id || 90 ;
  },
  mounted(){
    let params = {
      page : this.page,
      pageSize : this.pageSize ,
      city_id : this.city_id
    };
    getFacilitatorList(params).then( res => {
      this.facilitatorList = res.result.data ;
    })
  },
  methods: {
    loadingMore () {
      if (this.end) {
        return ;
      }
      //防止重复请求
      if (this.preventRepeatReuqest) {
        return ;
      }
      this.showLoading = true;
      this.preventRepeatReuqest = true;
      // 正在加载
      this.is_show = true ;
      this.showLoading = true ;
      this.page ++ ;
      let params = {
        page : this.page,
        pageSize : this.pageSize ,
        city_id : this.city_id
      };
      getFacilitatorList(params).then( res => {

        this.facilitatorList = [...this.facilitatorList , ...res.result.data ] ;
        // 加载完成
        this.is_show = false ;
        this.showLoading = false ;
        if( res.result.data.length < this.pageSize ){
          this.end = true ;
          this.is_show = true ;
          this.loadingTip = '没有更多数据了';
        }
        this.preventRepeatReuqest = false;
      })

    },
    back(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('back_home', "返回首页" , function (data) {}) ;
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
  @import "../../style/mixin";
  .mask{
    position: fixed;
    top: 0.44rem;
    left: 0.15rem;
    width: 0.8rem;
    height: 0.9rem;
    z-index: 150;
  }
  .list{
    border-top: 1px solid #ddd;
    .facilitator-item{
      padding: 0.24rem 0.24rem 0.2rem;
      margin-bottom: 0.2rem;
      background-color: #fff;
      .facilitator-link{
        display: block;
        >img{
          @include wh( 7.02rem , 3.4rem );
        }
        .title{
          padding: 0.26rem 0;
          font-size: 0.34rem;
          color: #1e1e1e;
        }
      }
      .contact{
        display: flex;
        padding: 0.2rem 0;
        border-top: 1px solid rgba(0,0,0,0.1);
        border-bottom: 1px solid rgba(0,0,0,0.1);
        .address{
          width: 5.8rem;
          border-right: 1px solid rgba(0,0,0,0.1);
          font-size: 0.24rem;
          color: #999;
          line-height: 0.34rem;
        }
        .consult{
          width: 1.16rem;
          padding-top: 0.2rem;
          text-align: right;
          font-size: 0.24rem;
          >span{
            display: block;
            color: $mainColor;
            .consult-icon{
              display: inline-block;
              vertical-align: middle;
              margin-right: 0.02rem;
              @include wh( 0.36rem, 0.36rem );
              @include bg-image('../../images/ic_call');
            }
          }
        }
      }
      .server-project{
        font-size: 0;
        .pro-item{
          display: inline-block;
          vertical-align: top;
          padding: 0 0.16rem;
          height: 0.4rem;
          margin: 0.2rem 0.2rem 0 0;
          line-height: 0.4rem;
          font-size: 0.22rem;
          color: $mainColor;
          background-color:rgba(0,119,255,0.1);
        }
      }
    }
  }
</style>
