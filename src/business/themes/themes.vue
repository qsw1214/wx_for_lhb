<template>
  <div>
    <v-head path="/home" isFixed="true">
      <div slot="center-part">专题推荐</div>
    </v-head>
    <section class="themes">
      <div v-load-more="loadingMore" v-if="themes.length" type="1">
        <div class="theme-item" v-for="( item , index ) in themes" :key="item.id">
           <router-link :to="{ name: 'themesDetail' , params : { id : item.id } }">
            <div class="theme-img">
              <img v-lazy="item.pic_url" alt="a" >
              <div class="name-wrap">
                <p class="theme-name">{{item.name}}</p>
              </div>
            </div>
          </router-link>
          <div class="theme-desc"><p class="doubleellipsis">{{item.description}}</p></div>
        </div>
      </div>
    </section>

    <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#e8e8e8"></load-more>
  </div>
</template>

<script>
import { getThemes , getBanners  } from 'src/service/getData'
import splitContent from 'src/components/splitContent'
import vHead from 'src/components/vHead'
import { loadMore } from 'src/components/mixin'
import { Swiper , SwiperItem , Flexbox , FlexboxItem , LoadMore } from 'vux'
import { small , half } from 'src/filters'
import { getStorage } from  'src/config/tools';
export default {
  data () {
    return {
      city_id : getStorage('cityId')|| this.$store.state.cityId || this.$route.query.city_id || 90 ,  // 当前城市
      themes : [], // 专题列表
      page : 1, // 当前页码
      pageSize : 10 , // 一页数量
      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false  , // 阻止重复请求
      is_show : false
    }
  },
  mixins : [ loadMore ] ,
  components : {
    Swiper,
    SwiperItem,
    Flexbox,
    FlexboxItem,
    splitContent,
    vHead,
    LoadMore
  },
  filters : { small , half },
  mounted () {
    this.initData()
  },
  methods : {
    initData(){
      let params = {
        city_id: this.city_id ,
        page : this.page,
        pageSize : this.pageSize
      };
      getThemes( params )
        .then( res => {
          this.themes = res.result;
        }).catch(err=>{
          // console.log(err)
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
        city_id: this.city_id ,
        page : this.page,
        pageSize : this.pageSize
      };
      getThemes( params )
        .then( res => {
          this.themes = [ ...this.themes , ...res.result ];
          // 加载完成
          this.is_show = false ;
          this.showLoading = false ;

          if( res.result.length < 5 ){
              this.end = true ;
              this.is_show = true ;
              this.loadingTip = '没有更多数据了';
          }
          this.preventRepeatReuqest = false;
        })
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin' ;
  .themes{
    width:100%;
    background: $bgc;
    .theme-item{
      background: #fff;
      margin-bottom: 0.2rem;
      @include wh( 100% , 5.1rem );
      .theme-img{
        position: relative;
        @include wh( 100% , 3.9rem) ;
        img{
          @include wh(100%,3.9rem) ;
        }
        .name-wrap{
          @include wh( 100% , 3.9rem );
          position: absolute;
          top:0;
          left:0;
          background: rgba(0,0,0,0.6);
          p.theme-name{
            text-align: center;
            line-height: 1.2rem;
            @include sc(0.52rem, #fff);
            @include center;
            @include wh( 100% , auto );
            &:before{
              content: '';
              position: absolute;
              bottom: 0;
              left:0;
              right:0;
              margin:0 auto;
              background: #fff;
              @include wh( 5.4rem , 0.02rem );
            }
            &:after{
              position: absolute;
              bottom: -0.08rem;
              left:0;
              right:0;
              margin:0 auto;
              background: #fff;
              content: '';
              @include wh( 5.4rem , 0.04rem );
            }
          }
        }
      }
      .theme-desc{
        @include wh( 100% , 1.2rem );
        padding: 0.2rem 0.28rem 0.3rem ;
        line-height: 0.35rem;
        p {
          font-size: 0.26rem;
          color: #666;
        }

      }
    }
  }

</style>
