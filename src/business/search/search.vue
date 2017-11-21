<template lang="html">
  <div>
      <div class="head border-1px">
        <div class="dropdown" @click="showDropdown">
          <span class="type">{{ typeText }}</span><span class="drop-icon"></span>
          <ul class="drop-down" v-show="dropdownShow">
              <li class="border-1px" @click="changeType(1)">场地</li>
              <!--<li class="border-1px" @click="changeType(2)">广告</li>-->
              <li class="border-1px" @click="changeType(3)">活动</li>
          </ul>
        </div>
        <form class="ipt">
          <div class="search-icon" @click="wordSearch"></div>
          <input type="search" autocomplete="off"
                 :placeholder="placeholder"
                 v-model="search"
                 @keyup.enter="wordSearch"
                 class="search-ipt">
        </form>
        <div class="cancle" @click="goBack">取消</div>
      </div>
      <div class="hot-search">
        <div class="title">热门搜索</div>
        <div class="word-box">
          <span class="word-item border-1px" @click="goHotword(item)" v-for="(item , index) in hotWords" :key="index">{{ item }}</span>
        </div>
      </div>
      <div class="recent-search gutter" v-if="recentSearch.length">
        <div class="title clear">
          <span class="left">最近搜索</span>
          <span class="right" @click="clearRecentSearch"></span>
        </div>
        <ul class="list">
          <li class="item border-1px" v-for="(item , index) in recentSearch" :key="index">
              <router-link :to="item.link">{{ item.word }}</router-link>
          </li>
        </ul>
      </div>
  </div>
</template>

<script>
  import { hotWord } from 'src/service/getData' ;
  import { getStorage , setStorage } from 'src/config/tools' ;
  import { COMPANY_REG } from 'src/config/data';

  const pathArr = ['fields','ads' , 'activities'];
  const textArr = ['场地','广告','活动'];
export default {
  data () {
    return {
      typeId : null , // 资源类型 默认为场地
      typeText : '',
      placeholder : '' ,
      search : '' , // 搜索词,
      hotWords : [] , // 热门搜索
      recentSearch : [] , // 最近搜索
      dropdownShow : false
    }
  },
  created(){
    let recentsearch = getStorage( 'recentSearch' ) ;
    if( recentsearch && recentsearch.length ){
      this.recentSearch = recentsearch ;
    }
    // 获取到搜索的资源类型
    this.typeId = +this.$route.query.resourceType || 1 ;
  },
  mounted (){
    this.init();
  },
  methods : {
    init(){
      let cityId = getStorage('cityId') || this.$store.state.cityId ;
      let params = {
        cityId ,
        res_type_id : this.typeId
      };
      hotWord( params ).then( res => {
        this.hotWords = res.result ;
      });
      this.typeText = textArr[this.typeId - 1] ;
      this.placeholder = `请输入${ this.typeText }名称` ;
    },
    goBack() {
      this.$router.go(-1);
    },
    showDropdown(){
      this.dropdownShow = !this.dropdownShow ;
    },
    changeType(n){
      this.typeId = n ;
      this.typeText = textArr[this.typeId - 1] ;
      this.placeholder = `请输入${ this.typeText }名称` ;
      this.init() ;
    },
    wordSearch(){
      let index = this.typeId - 1;
      if( this.search ) {
        if (!COMPANY_REG.test(this.search)) {
          this.$vux.toast.text('你的输入包含特殊字符，请重新输入', 'middle');
          this.search = '';
          return false;
        } else {
          let recentsearch = getStorage( 'recentSearch' ) || [] ;
          if( recentsearch&&recentsearch.length ){
            if( recentsearch.length >= 10 ){
              recentsearch.pop();
            }
            let flag = false ;
            for( let item of recentsearch ){
              if( item.word == this.search ){
                flag = true ; break;
              }
            }
            if( !flag ){
              recentsearch.unshift( { word : this.search , link : `/${pathArr[index]}?keywords=${encodeURIComponent(this.search)}` } );
            }
          }else{
            recentsearch.unshift( { word : this.search , link : `/${pathArr[index]}?keywords=${encodeURIComponent(this.search)}` } );
          }
          setStorage( 'recentSearch',recentsearch );
          this.$router.push({path: pathArr[index], query: {keywords: encodeURIComponent(this.search)}})
        }
      }else{
        this.$router.push({path: pathArr[index]})
      }
    },
    clearRecentSearch(){
      setStorage( 'recentSearch', [] );
      this.recentSearch = [] ;
    },
    goHotword( text ){
      let index = this.typeId - 1 ;
      this.$router.push({path: pathArr[index], query: {keywords: encodeURIComponent(text)}})
    }
  },
  beforeRouteLeave(to , from , next){
    to.meta.keepAlive = false ;
    next();
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin" ;
  .head {
    padding : 0.18rem 0.28rem;
    @include bb-1px( #ddd );
    font-size: 0;
    background-color: #fff;
    .dropdown {
      display: inline-block;
      position : relative ;
      .type {
        margin-right: 0.1rem;
        font-size: 0.26rem;
        color: #333;
      }
      .drop-icon {
        display: inline-block;
        @include wh( 0.2rem , 0.1rem );
        margin-bottom: 0.05rem;
        @include bg-image( '../../images/ic_close_two_five' );
        background-size: 0.2rem 0.1rem;
        background-repeat: no-repeat;
      }
      .drop-down {
          position: absolute;
          z-index: 1;
          top : 0.36rem;
          left : -0.18rem;
          @include wh( 1.4rem , 1.4rem );
          padding: 0.08rem 0.1rem 0;
          @include bg-image( '../../images/ic_bg_two_five' );
          >li {
           @include wh( 100% , 0.7rem );
            @include bb-1px( #ddd );
            line-height: 0.7rem;
            text-align: center;
            font-size: 0.26rem;
            color: #fff;
            &:last-child{
                @include bd-none;
             }
          }
      }
    }
    .ipt {
      position: relative;
      display: inline-block;
      margin: 0 0.5rem 0 0.2rem;
      .search-ipt {
        @include wh( 4.8rem , 0.52rem );
        padding-left: 0.5rem;
        border-radius: 0.04rem ;
        font-size: 0.24rem;
        background-color: #eee;
        &::-webkit-input-placeholder {
          font-size: 0.24rem;
          color: #ccc;
        }
      }
      .search-icon{
          position: absolute;
          top: 0.1rem;
          left : 0.1rem;
          @include wh( .36rem , 0.34rem );
          @include bg-image( '../../images/ic_search_gray_normal_three' );
      }
    }
    .cancle {
      display: inline-block;
      font-size: 0.24rem;
      color: #999;
    }
  }
  .hot-search {
    padding: 0.3rem 0.28rem 0.4rem 0.28rem;
    background-color: #fff;
    .title {
      font-size: 0.28rem;
      color: #999;
    }
    .word-box {
      font-size: 0;
      .word-item {
        display: inline-block;
        height: 0.64rem;
        line-height: 0.64rem;
        padding: 0 0.3rem;
        margin : 0.2rem 0.2rem 0 0 ;
        border: 1px solid #ddd;
        border-radius: 0.04rem ;
        font-size: 0.24rem;
        color: #333;
      }
    }
  }
  .recent-search {
    margin-top: 0.2rem;
    overflow: hidden;
    background-color: #fff;
    .title {
      margin-top: 0.3rem;
      font-size: 0.28rem;
      > span {
        color: #999;
        &:nth-of-type(2) {
          display: inline-block;
          @include wh( 0.26rem , 0.32rem );
          @include bg-image( '../../images/ic_delete' );
          background-size: 0.26rem 0.32rem;
          background-repeat: no-repeat;
        }
      }
    }
    .list {
      .item {
        height: 0.9rem;
        line-height: 0.9rem;
        @include bb-1px( #ddd );
        font-size: 0.24rem;
        color: #333;
        > a {
          display: block;
        }
        &:last-child {
          @include bd-none ;
        }
      }
    }
  }
</style>
<style lang="scss">
    @import "../../style/mixin" ;
    html , body {
        background-color: $bgc;
    }
</style>
