<template lang="html">
  <div>
    <v-head isFixed="true" path="/home">
      <div slot="center-part">自营商城</div>
    </v-head>
    <section class="head-banner"></section>
    <section class="list" :class="{ mb : $route.query.footer==1 }" v-load-more="loadingMore" type="1" v-if="total>0">
        <v-fieldlist :field="item" v-for="( item , index ) in fields" :key="index"></v-fieldlist>
        <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
    </section>
    <section class="noresult-box" ref="noresult" v-else>
        <div class="noresult"><span class="noresult-img"></span></div>
        <p class="noresult-info">暂无结果</p>
        <p class="noresult-info">去发布需求，让邻汇吧帮我找场地</p>
        <div>
          <router-link to="demand" class="demand-btn">发布需求</router-link>
        </div>
    </section>
    <v-footer :twoselected="true" v-if="$route.query.footer==1"></v-footer>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
  import vFooter from 'src/components/vFooter';
  import vFieldlist from 'src/components/vFieldlist';
  import { getResources } from 'src/service/getData';
  import { initDataConfig } from 'src/config/data' ;
  import { loadMore } from 'src/components/mixin';
  import { LoadMore } from 'vux' ;
  import { getStorage } from 'src/config/tools';
export default {
  data () {
    return {
      fields : [], // 场地列表
      page : 1 , // 初始页码
      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,
      total : 1, // 资源总数
    }
  },
  components: { vFieldlist , LoadMore , vHead , vFooter },
  mixins : [ loadMore ] ,
  created(){
    this.city_id = getStorage('cityId') || this.$route.query.city_id || 90 ;
    this.$vux.loading.show({
      text: 'loading...'
    });
  },
  methods : {
    init(){

      let params = {
        page : this.page ,
        pageSize : 10 ,
        self_support : 1 ,
        city_id : this.city_id
      };
      let obj = initDataConfig(params) ;
      getResources( obj ).then( res => {
        this.fields = res.result ;
        this.total = res.total ;
        this.$vux.loading.hide();
      })

    },
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
        page : this.page ,
        pageSize : 10 ,
        self_support : 1,
        city_id : this.city_id
      };
      let obj = initDataConfig(params) ;
      getResources( obj ).then( res => {
        this.total = res.total ;
        this.fields = [ ...this.fields , ...res.result ];
        // 加载完成
        this.is_show = false ;
        this.showLoading = false ;
        if( res.result.length < 10 ){
          this.end = true ;
          this.is_show = true ;
          this.loadingTip = '没有更多数据了';
        }
        this.preventRepeatReuqest = false;
      })
    },
  },
  mounted(){
    this.init();
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .head-banner{
    @include wh(100% ,3.2rem);
    @include bg-image('../../images/banner_self operated');
  }
  .list{
    &.mb{
      padding-bottom: 1.2rem;
    }
  }
  .noresult-box{
    padding-bottom: 1rem;
    background-color: #f0f0f0;
    .noresult{
      text-align: center;
      .noresult-img{
        display: inline-block;
        margin-top: 0.2rem;
        @include wh( 1.78rem , 2.64rem );
        @include bg-image('../../images/ic_search_two_six');
      }
    }
    .noresult-info{
      text-align: center;
      font-size: 0.28rem;
      color: #999;
      &:nth-of-type(1){
        margin-top: 0.8rem;
      }
      &:nth-of-type(2){
        margin-top: 0.19rem;
      }
    }
    .demand-btn{
      display: block;
      @include wh( 2.4rem , 0.9rem );
      margin: 0.4rem auto 0;
      line-height: 0.9rem;
      text-align: center;
      border: 1px solid #e8e8e8;
      font-size: 0.32rem;
    }
  }
</style>
