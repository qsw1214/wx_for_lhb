<template lang="html">
  <div class="field-wraper">
   <div class="fixed-wraper">
    <header>
      <div class="back">
        <router-link to="home" class="back-link">
          <span class="back-icon"></span>
        </router-link>
      </div>
      <div class="search vt">
        <router-link to="/search">
          <span class="searchIcon"></span>
          <!--<input type="search" placeholder="请输入小区/楼宇关键字" v-model="searchValue">-->
          <div class="link-search">{{ keyword }}</div>
        </router-link>
      </div>
      <!--<div class="map">-->
        <!--<router-link to="/map">-->
          <!--<span class="map-icon"></span>-->
        <!--</router-link>-->
      <!--</div>-->
    </header>
    <section class="filter">
       <flexbox :gutter="0">
          <flexbox-item :span="1/4" class="ct">
              <div class="filter-rule" :class="{
                 active : filterData.order_by == 'default_sort'|| filterData.order_by == 'created_at'|| filterData.order_by == 'number_of_people'|| filterData.order_by =='cost_performance' }" @click.stop="listSelected">
                <span>{{ pickVal }}</span><span class="cert"></span>
              </div>
          </flexbox-item>
          <flexbox-item :span="1/4" class="ct">
              <div class="order" :class="{ active : filterData.order_by == 'number_of_order' }" @click.stop="orderSelected">
                <span>销量</span>
              </div>
          </flexbox-item>
          <flexbox-item :span="1/4" class="ct">
              <div class="order-price"
              :class="{
              active : filterData.order_by == 'min_price' ,
              asc : filterData.order_by == 'min_price'&& filterData.order == 'asc' ,
              desc : filterData.order_by == 'min_price'&& filterData.order == 'desc'
              }"
              @click.stop="priceSelected">
                <span>价格</span><span class="arrow"></span>
              </div>
          </flexbox-item>
          <flexbox-item :span="1/4" class="ct">
              <div class="filter-btn" :class="{ active : filterSelect }" @click.stop="filterSelected">
                <router-link to="/fields/filter">
                  <span>筛选</span><span class="select-icon"></span>
                </router-link>
              </div>
          </flexbox-item>
       </flexbox>
       <div class="dropdown" v-show="showDropdown" ref="mask" @click.stop="showDropdown = false">
          <ul class="down-ul">
            <li class="down-ul-item" v-for="( item , index ) in fieldSort" :class="{ active : filterData.order_by == item.order_by && filterData.order == item.order }" @click="pickPx( item , index )" :key="index">
              <span>{{ item.display_name }}</span><span class="icon"></span>
            </li>
          </ul>
       </div>
    </section>
    <section class="filter-label">
        <flexbox :gutter="0">
           <flexbox-item :span="1/4" class="ct">
             <span class="label-item" :class="{ active : isOneSelect || this.filterData.self_support }" @click="labelSelected(1)">自营</span>
           </flexbox-item>
           <flexbox-item :span="1/4" class="ct">
             <span class="label-item" :class="{ active : isTwoSelect || this.filterData.hot }" @click="labelSelected(2)">热门</span>
           </flexbox-item>
           <flexbox-item :span="1/4" class="ct">
             <span class="label-item" :class="{ active : isThreeSelect || this.filterData.subsidy }" @click="labelSelected(3)">特卖</span>
           </flexbox-item>
        </flexbox>
    </section>
   </div>
    <section class="list" v-load-more="loadingMore" type="1" v-if="total>0">
        <v-fieldlist :field="item" v-for="( item , index ) in fields" :key="index"></v-fieldlist>
        <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
    </section>
    <section class="noresult-box" ref="noresult" v-else>
        <div class="noresult"><span class="noresult-img"></span></div>
        <p class="noresult-info">暂无搜索结果</p>
        <p class="noresult-info">去发布需求，让邻汇吧帮我找场地</p>
        <div>
          <router-link to="demand" class="demand-btn">发布需求</router-link>
        </div>
    </section>

    <transition name="router-slide" mode="out-in">
        <router-view @toFather="marge"></router-view>
    </transition>
  </div>

</template>

<script>

  import vHead from 'src/components/vHead';
  import vFieldlist from 'src/components/vFieldlist';
  import { Flexbox , FlexboxItem , LoadMore } from 'vux' ;
  import { mapActions , mapMutations , mapState } from 'vuex' ;
  import { getResources } from 'src/service/getData';
  import { initDataConfig } from 'src/config/data' ;
  import { getStorage } from 'src/config/tools';
  import { loadMore } from 'src/components/mixin';
  import { wxshare } from 'src/config/wechatShare';
  let childData = null ; // 记录筛选框里筛选条件
export default {
  data(){
    return {
      fields : [], // 场地列表
      fieldSort : [] , // 排序下拉列表
      time : 0 , // 记录价格第几次点击
      showDropdown : false , // 排序的下拉框
      pickVal : '综合',
      filterSelect : false , // 筛选
      queryFilterData : null , // 链接参数
      keyword : '请输入小区/楼宇关键字',

      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,

      isOneSelect : false , // 标签选择
      isTwoSelect : false , // 标签选择
      isThreeSelect : false , // 标签选择
      filterData : {
        city_id : null,
        resource_type : 1,
        page : 1 ,
        pageSize : 10,
        order : 'desc',
        order_by: 'default_sort',
      } , // 筛选条件
      total : 1, // 资源总数
    }
  },
  components: { Flexbox , FlexboxItem , vFieldlist , LoadMore },
  mixins : [ loadMore ] ,
  created(){
    this.$store.dispatch('refreshConfig') ;
    this.$vux.loading.show({
      text: 'loading...'
    });
// 处理从搜索页或者app传过来的筛选条件
    this.queryFilterData = this.$route.query ;

    if( JSON.stringify(this.queryFilterData ) == "{}" ){
    }else{
      // 注意  主要处理app传参不能直接解析的问题
      function changeAppData( app ) {
        if(app){
          let arr = app.split(',');
          let newArr = [] ;
          for( let item of arr ){
            item = parseInt( item );
            newArr.push( item );
          }
          return newArr ;
        }
      }
      if(this.$route.query.is_app ){
        delete this.$route.query.is_app ;
        // 对象引用
        let appData = this.$route.query ;
        if( appData.facilities ){
          appData.facilities = appData.facilities + "" ;
          let arr = appData.facilities.split(',');
          appData.facilities = arr ;
        }
        if( appData.label_id ){
          appData.label_id = changeAppData( appData.label_id + "" );
        }
        if( appData.trading_area_id ){
          appData.trading_area_id = changeAppData( appData.trading_area_id + "" );
        }
        if( appData.community_type_id ){
          appData.community_type_id = changeAppData( appData.community_type_id + "");
        }
        if( appData.district_id ){
          appData.district_id = changeAppData( appData.district_id + "");
        }
        if( appData.activity_type_id ){
          appData.activity_type_id = changeAppData( appData.activity_type_id + "");
        }
        if( appData.ad_type_id ){
          appData.ad_type_id = changeAppData( appData.ad_type_id + "");
        }
        if( appData.field_type_id ){
          appData.field_type_id = changeAppData( appData.field_type_id + "");
        }
        if( appData.indoor ){
          appData.indoor = changeAppData( appData.indoor + "");
        }
      }

      this.filterData = { ...this.filterData , ...this.queryFilterData } ;
      if( this.queryFilterData.keywords ){
        this.keyword = decodeURIComponent( this.queryFilterData.keywords );
      }else{
        this.keyword = '请输入小区/楼宇关键字' ;
      }

      this.RECORD_FILTERDATA( this.filterData ); // 记录链接里的参数，在筛选页展示
    }
  },
  mounted(){

    if( JSON.stringify( childData ) == "{}"|| JSON.stringify( childData ) == "null" ){
      // 空值，不高亮
      this.filterSelect = false ;
    }else{
      this.fields = [] ;
      this.filterSelect = true ;
      this.filterData = { ...this.filterData , ...childData } ;
    }

    this.init();
    let config = this.config || getStorage('config') ;
    this.fieldSort =  config.field_sort ;
    // 渲染综合排序的数据
    if( this.queryFilterData.order_by ){
      let order = this.queryFilterData.order || 'desc';
      let order_by = this.queryFilterData.order_by ;
      for( let item of this.fieldSort ){
        if( item.order_by == order_by && item.order == order ){
          this.pickVal = item.display_short_name ;
        }
      }
    }
    this.$refs.mask.addEventListener('touchmove' , (e) => {
      e.preventDefault();
    }, false);

//    let str = '' ;
//    for(let query in this.filterData ){
//      if( Array.isArray(query) ){
//        query = this.filterData[query].join(',') ;
//      }
//    }
    wxshare({
      title : '我在邻汇吧发现一批不错的地推场地',
      desc : '共找到'+ this.total + '个资源，推荐你也去看看' ,
      imgUrl : 'https://comment.linhuiba.com/FgKZMHwcsI-0sAC0mbk6BgzGNLCy',
      link : window.location.origin + '?from=singlemessage'+ window.location.hash ,
    });
  },
  computed : {
    ...mapState(['config'])
  },
  methods:{
    ...mapActions(['refreshConfig']),
    ...mapMutations(['RECORD_FILTERDATA']),
    init(){
      this.filterData.city_id = getStorage('cityId')|| this.$store.state.cityId || this.$route.query.city_id || 90;
      this.resetLoadMore();
      this.filterData.page = 1 ;
      let params = initDataConfig(this.filterData) ;
      getResources( params ).then( res => {
        this.fields = res.result ;
        this.total = res.result.length ;
        this.$vux.loading.hide();
      }).catch(err => {
        this.$vux.loading.hide();
        this.$vux.toast.text('数据请求错误');
      });

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
      this.filterData.page ++ ;
      let params = initDataConfig(this.filterData);
      getResources( params ).then( res => {
        this.total = res.total ;
        this.fields = [ ...this.fields , ...res.result ];
        // 加载完成
        this.is_show = false ;
        this.showLoading = false ;
        if( res.result.length < this.filterData.pageSize ){
          this.end = true ;
          this.is_show = true ;
          this.loadingTip = '没有更多数据了';
        }
        this.preventRepeatReuqest = false;
      })
    },
    labelSelected(m){
      if( m == 1 ){
        // 自营
        this.isTwoSelect = this.isThreeSelect = false; // 排他
        this.isOneSelect = !this.isOneSelect ;
        Object.assign( this.filterData , { self_support : 1 } );
      }else if( m == 2 ){
        // 热门
        this.isOneSelect = this.isThreeSelect = false;
        this.isTwoSelect = !this.isTwoSelect ;
        Object.assign( this.filterData , { hot : 1 } );
      }else if( m == 3 ){
        // 倒贴
        this.isOneSelect = this.isTwoSelect =  false;
        this.isThreeSelect = !this.isThreeSelect ;
        Object.assign( this.filterData , { subsidy : 1 } );
      }
      if( !this.isOneSelect ){
        delete this.filterData.self_support;
      }
      if( !this.isTwoSelect ){
        delete this.filterData.hot;
      }
      if( !this.isThreeSelect ){
        delete this.filterData.subsidy;
      }
      this.init();
    },

    listSelected(){
      this.showDropdown = !this.showDropdown ;
    },
    pickPx( item ){
      this.time = 0 ;
      this.pickVal = item.display_short_name ;
      this.filterData.order = item.order ;
      this.filterData.order_by = item.order_by ;
      this.showDropdown = false ;
      this.init();
    },

    orderSelected(){
      this.time = 0 ;
      this.showDropdown = false ;
      this.filterData.order = 'desc' ;
      this.filterData.order_by = 'number_of_order' ;
      this.init();
    },
    priceSelected(){
      this.showDropdown = false ;
      this.time ++ ;
      if( this.time % 2 == 0 ){
        this.filterData.order = 'asc';
      }else{
        this.filterData.order = 'desc';
      }
      this.filterData.order_by = 'min_price';
      this.init();
    },
    filterSelected(){
      this.showDropdown = false ;
      this.time = 0
    },
    marge( data ){
      // 处理从筛选子页面传递的筛选条件
      this.filterSelect = true ; // 筛选高亮
      if( childData ){
        // 有值 删除上一次的筛选条件
        for(let item in childData ){
          delete this.filterData[item] ;
        }
      }
      childData = Object.assign( {} , data ) ;
    },
    resetLoadMore(){
      this.showLoading = false ;
      this.loadingTip = '正在加载...';
      this.end = false ; // 到底了
      this.preventRepeatReuqest = false ; // 阻止重复请求
      this.is_show = false ;
    },
  },
//  beforeRouteLeave(to,from,next){
//    // 保证进入详情页的时候列表页处于缓存状态
//    from.meta.keepAlive = true ;
//    next()
//  }

}
</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .router-slide-enter-active, .router-slide-leave-active {
    transition: all 0.4s;
  }
  .router-slide-enter, .router-slide-leave-active {
    transform: translateX( 100% );
    opacity: 0;
  }
  /*-------------------*/

  .field-wraper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-wraper{
      position: fixed;
      top: 0;
      left:0;
      width: 100%;
      z-index: 1;
      header{
        display: flex;
        padding: 0.12rem 0.24rem;
        border-bottom: 1px solid #e8e8e8;
        background-color: #fff;
        .back{
          flex : 0 0 0.7rem;
          height: 0.64rem;
          .back-link{
            display: block;
            .back-icon{
              display: inline-block;
              vertical-align: top;
              @include wh( 0.2rem ,0.36rem );
              margin: 0.14rem 0.5rem 0 0;
              @include bg-image('../../images/ic_returnbutton_normal_three');
            }
          }
        }
        .search {
          flex: 0 0 5.6rem;
          position: relative;
          height: 0.64rem;
          .searchIcon {
            position: absolute;
            left: 0.2rem;
            top: 0.14rem;
            @include wh( 0.36rem , 0.34rem );
            @include bg-image( "../../images/ic_search_gray_normal_three" );
          }
          .link-search {
            background-color: rgba( 255,255,255,1 );
            @include wh( 100% , 100% );
            line-height: 0.64rem;
            padding-left: 0.71rem;
            border-radius: 0.32rem;
            font-size: 0.28rem;
            color: #b4b4b4;
            background-color: #f0f0f0;
          }
        }
        /*.map{
          flex: 0 0 0.7rem;
          text-align: right;
          .map-icon{
            display: inline-block;
            @include wh( 0.4rem , 0.4rem );
            margin-top: 0.1rem;
            @include bg-image('../../images/ic_map_black_default_three');
          }
        }*/
      }
      .filter{
        line-height: 0.88rem;
        border-bottom: 1px solid #e8e8e8;
        font-size: 0.28rem;
        color: #282a2a;
        background-color: #fff;
        position: relative;
        .dropdown{
          position: fixed;
          top: 1.76rem;
          left:0;
          bottom: 0;
          right: 0;
          z-index: 2;
          overflow-y: hidden;
          background-color: rgba( 0, 0, 0 ,0.6 );
          .down-ul{
            padding: 0.2rem 0.58rem;
            background-color: #fff;
            .down-ul-item{
              display: flex;
              justify-content: space-between;
              line-height: 0.66rem;
              font-size: 0.28rem;
              color: #666;
              &.active{
                color: $mainColor;
                .icon{
                  @include wh( 0.38rem , 0.28rem );
                  margin-top: 0.19rem;
                  @include bg-image('../../images/ic_right_normal_one_three');
                }
              }
            }
          }
        }
        .filter-rule{
          .cert{
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.08rem;
            @include wh( 0.2rem , 0.1rem );
            @include bg-image('../../images/ic_open_button_normal_three');
          }
          &.active{
            color: $mainColor;
            .cert{
              @include bg-image('../../images/ic_open_one_button_blue_normal_three');
              &.on{
                @include bg-image('../../images/ic_open_button_blue_normal_three');
              }
            }
          }
        }
        .order{
          &.active{
            color: $mainColor;
          }
        }
        .order-price{
          .arrow{
            display: inline-block;
            vertical-align: middle;
            margin-left:0.08rem;
            @include wh( 0.18rem , 0.22rem );
            @include bg-image('../../images/ic_sort_default_three');

          }
          &.active {
            color: $mainColor;
          }
          &.asc{
            .arrow {
              @include bg-image('../../images/ic_sort_pressed_one_three');
            }
          }
          &.desc{
            .arrow{
              @include bg-image('../../images/ic_sort_pressed_two_three');
            }
          }
        }
        .filter-btn{

          >a{
            display: block;
            .select-icon{
              display: inline-block;
              vertical-align: middle;
              @include wh( 0.24rem , 0.26rem );
              margin-left:0.08rem;
              @include bg-image('../../images/ic_filter_default_three');
            }
          }
          &.active{
            a{
              color: $mainColor;
              .select-icon{
                @include bg-image('../../images/ic_filter_pressed_three');
              }
            }
          }
        }
      }
      .filter-label{
        line-height: 0.8rem;
        border-bottom: 1px solid #e8e8e8;
        background-color: #fff;
        font-size: 0.24rem;
        color: #666;
        .label-item{
          display: inline-block;
          @include wh( 1.2rem , 0.48rem );
          line-height: 0.48rem;
          text-align: center;
          border-radius: 0.06rem;
          background-color: #f5f5f5;
          &.active{
            color: $mainColor;
            border: 1px solid $mainColor;
            background-color: #fff;
          }
        }
      }
    }
    .list{
      padding-top:2.56rem;
    }
    .noresult-box{
      margin-top: 2rem;
      background-color: #f0f0f0;
      .noresult{
        text-align: center;
        .noresult-img{
          display: inline-block;
          margin-top: 2.15rem;
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
  }
</style>
