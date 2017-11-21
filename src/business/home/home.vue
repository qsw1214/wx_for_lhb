<template>
  <div class="margin-bottom" ref="scroll">
    <header class="" ref="head">
      <div class="drop">
        <div class="city">
          <router-link to="/home/city" class="city-link"><span class="cityct" v-text="cityName"></span><span class="caret"></span></router-link>
        </div>
      </div>

      <div class="search vt">
        <router-link to="/search">
          <span class="searchIcon"></span>
          <!--<input type="search" placeholder="请输入小区/楼宇关键字" v-model="searchValue">-->
          <div class="link-search">请输入小区/楼宇关键字</div>
        </router-link>
      </div>
    </header>
    <section ref="swiper" class="swiper">
      <swiper loop auto :interval=4000 dots-position="center" dots-class="custom-bottom" class="banners" :aspect-ratio="320/750" >
        <swiper-item v-for="( item , index ) in bannerimgs" :key="index">
          <router-link :to="item.link" tag="li">
            <img v-lazy="item.pic_url" :alt="item.title" >
          </router-link>
        </swiper-item>
      </swiper>
    </section>
    <section class="tags">
      <flexbox :gutter="0" wrap="wrap">
         <flexbox-item :span="4">
           <div class="tag ct">
             <router-link to="/fields">
               <div class="fld margin"></div>
               <p>场地</p>
             </router-link>
           </div>
         </flexbox-item>
         <flexbox-item :span="4">
           <div class="tag ct">
             <router-link to="/activities">
               <div class="act margin"></div>
               <p>活动</p>
             </router-link>
           </div>
         </flexbox-item>
         <!--<flexbox-item :span="3">-->
           <!--<div class="tag ct">-->
             <!--<router-link to="/ads">-->
               <!--<div class="adv margin"></div>-->
               <!--<p>广告</p>-->
             <!--</router-link>-->
           <!--</div>-->
         <!--</flexbox-item>-->
          <!--<flexbox-item :span="3">-->
              <!--<div class="tag ct">-->
                  <!--<router-link to="/map">-->
                      <!--<div class="map margin"></div>-->
                      <!--<p>看图找地</p>-->
                  <!--</router-link>-->
              <!--</div>-->
          <!--</flexbox-item>-->

          <flexbox-item :span="4">
              <div class="tag ct">
                  <router-link to="/mall">
                      <div class="mall margin"></div>
                      <p>自营商城</p>
                  </router-link>
              </div>
          </flexbox-item>
          <flexbox-item :span="4">
              <div class="tag ct">
                  <router-link to="/demand">
                      <div class="rdm margin"></div>
                      <p>需求定制</p>
                  </router-link>
              </div>
          </flexbox-item>
          <flexbox-item :span="4">
              <div class="tag ct">
                  <router-link to="/group">
                      <div class="partnership margin"></div>
                      <p>拼团</p>
                  </router-link>
              </div>
          </flexbox-item>
          <flexbox-item :span="4">
              <div class="tag ct">
                  <router-link to="/invite">
                      <div class="invite margin"></div>
                      <p>邀请有奖</p>
                  </router-link>
              </div>
          </flexbox-item>
       </flexbox>
    </section>
    <section class="special" v-if="fieldTypes.length">
      <div class="field">
        <span class="field-icon common-icon"></span><span class="common-title">场地类型</span>
        <router-link to="/fieldtypeList" class="more"><span class="txt">查看更多</span><i class="icon"></i></router-link>
      </div>
      <div class="wrapBox">

          <div class="classifycontent" :style="{ width : fieldTypes.length * 3.34 + 'rem'  }">
            <div class="field-item" v-for="( item , index ) in fieldTypes" :key="index">
              <div class="field-type" @click.stop="goFields(item.field_type)">
                <img v-lazy="item.home_map_pic_url" :datasrcset="item.home_map_pic_url" :alt="item.name" class="field-img">
                <!--<div class="img-mask">-->
                  <!--<span class="mask-icon">-->
                    <!--<span v-for="( type , i ) in item.field_type" :key="i">{{ i > 0 ? '·': '' }}{{ type.name }}</span>-->
                  <!--</span>-->
                <!--</div>-->
              </div>
            </div>
          </div>

      </div>
    </section>
    <split-content></split-content>
    <section class="special" v-if="recentActs.length">
      <div class="activity">
        <span class="activity-icon common-icon"></span><span class="common-title">近期活动</span>
        <router-link to="/activities" class="more"><span class="txt">查看更多</span><i class="icon"></i></router-link>
      </div>
      <div class="wrapBox">

          <div class="classifycontent" :style="{ width : recentActs.length < 5 ? recentActs.length* 3.34+ 'rem' : 5*3.34 + 'rem' }">
            <div class="field-item" v-for="( item , index ) in recentActs" v-if="index < 5">
              <router-link :to="{ name: 'activitiesDetail', params: { id : item.resource_id } }">
                <div class="relative">
                  <img v-lazy="item.pic_url" :data-srcset="item.pic_url | half" :alt="item.field_name">
                  <div class="time-box">
                    <span class="time">{{ item.activity_start_date | timeFormat }}-{{ item.deadline | timeFormat }}</span>
                  </div>
                </div>
                <div class="decript border-1px">
                  <div class="ellipsis common-field" v-cloak>
                    {{ item.resource_name }}
                  </div>
                  <div class="des-content clear">
                    <div class="ellipsis">
                      <span class="price-mark">￥</span><span v-cloak class="price">{{ (item.price / 100) | twoPoint }}</span><span class="price-next">起</span>
                    </div>
                  </div>
                </div>
              </router-link>
          </div>
          </div>

      </div>
    </section>
    <split-content></split-content>
    <section class="coord">
        <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="1/2" class="prt">
                <router-link :to="{ path : 'fields' , query : { subsidy : 1 } }" class="day-specail">
                </router-link>
            </flexbox-item>
            <flexbox-item :span="1/2" class="plt">
                <router-link :to="{ path : 'fields' , query : { order_by : 'created_at' , order : 'desc' } }" class="new-field">
                </router-link>
            </flexbox-item>
            <flexbox-item :span="1/2" class="prt">
                <router-link to="/facilitatorlist" class="good-service">
                </router-link>
            </flexbox-item>
            <flexbox-item :span="1/2" class="plt">
                <router-link to="/thematic" class="feature-show">
                </router-link>
            </flexbox-item>
        </flexbox>
      </section>
    <split-content></split-content>
    <section class="themes" v-if="themes.length">
        <div class="title border-1px">
            <span class="themes-icon common-icon"></span><span class="common-title">精选专题</span>
            <router-link to="/themes" class="more"><span class="txt">查看更多</span><i class="icon"></i></router-link>
        </div>
        <div class="themes-content">
           <!--<div class="item border-1px item-1">-->
             <!--<router-link to="/" class="item-link">-->
                 <!---->
             <!--</router-link>-->
           <!--</div>-->
            <!--<div class="item border-1px item-2">-->
                <!--<router-link to="/" class="item-link">-->
                <!--</router-link>-->
            <!--</div>-->
            <!--<div class="item border-1px item-3">-->
                <!--<router-link to="/" class="item-link">-->
                <!--</router-link>-->
            <!--</div>-->
            <div class="themes-item border-1px" v-for="( item , index ) in themes" :key="index">
              <router-link :to="{ name: 'themesDetail' , params : { id : item.id } }">
                <img v-lazy="item.pic_url" :alt="item.name">
              </router-link>
            </div>
        </div>
      </section>
    <split-content></split-content>
    <section class="case" v-if="cases.length">
      <div class="title">
        <span class="case-icon common-icon"></span><span class="common-title">合作案例</span>
      </div>
      <div class="case-content" v-if="cases.length">

          <div class="case-box" :style="{ width : cases.length * 4.84 + 'rem' }">
            <div class="case-item" v-for="( item , index ) in cases" :key="index">

              <a :href="item.origin" class="item-link" v-if="item.origin">
                <img v-lazy="item.pic_url" :alt="item.name" class="pic">
              </a>
              <router-link class="item-link" :to="{ name : 'article' , params : { id : item.id } }" v-else>
                <img v-lazy="item.pic_url" :alt="item.name" class="pic">
              </router-link>
            </div>
          </div>

      </div>
    </section>
    <div class="download">
      <div class="down-logo">
      </div>
      <div>
        <p>更多完整实用功能</p>
        <p>尽在邻汇吧客户端</p>
      </div>
      <div class="download-btn">
        <a href="http://hz.linhuiba.com/app/business_download_app.html">
            下载APP
        </a>
      </div>
    </div>

    <v-footer :oneselected="true"></v-footer>
    <go-top></go-top>
  </div>
</template>

<script>

import { getCurrentCity , getCitys , getBanners ,getThemes , getResources ,getCase , getCategory } from 'src/service/getData'
import splitContent from 'src/components/splitContent'
import vFooter from 'src/components/vFooter'
import goTop from 'src/components/goTop'
import { Swiper , SwiperItem , Flexbox , FlexboxItem } from 'vux'
import { small , half , timeFormat ,twoPoint } from 'src/filters'
import { mapState , mapMutations } from 'vuex'
import { getStorage , setStorage , getStyle } from 'src/config/tools'
import { initDataConfig } from 'src/config/data'

export default {
  data () {
    return {
      currentCityId : '',  // 当前城市
      cityName : '定位中' ,
      searchValue : '', // 搜索关键词
      bannerimgs : [], // 轮播图
      recentActs : [] , // 最近活动
      cases : [] , // 合作案例
      themes : [] , // 专题列表
      fieldTypes : [] ,// 场地类型
    }
  },
  components : {
    Swiper,
    SwiperItem,
    Flexbox,
    FlexboxItem,
    splitContent,
    vFooter,
    goTop
  },
  filters : {
    small,
    half,
    twoPoint,
	  timeFormat
  },
  beforeRouteLeave(to , from , next){
    to.meta.keepAlive = false ;
    next()
  },
  async created () {
    // 展示加载动画
    this.$vux.loading.show({
      text: 'loading...'
    });
    // 用户当前城市
    let cityId = getStorage( 'cityId' )  ;
    let cityName = getStorage( 'cityName' )  ;
    if( cityId && cityName ){
      this.currentCityId = cityId ;
      this.cityName = cityName ;
    }else {
      let city = await getCurrentCity() ;
      let cityName = city.result.city;
      getCitys().then(res => {
        this.ALL_CITYS(res.result);
        for (let item of res.result) {
          if (item.name == cityName) {
            // 定位到当前位置城市
            this.cityName = item.name;
            this.currentCityId = item.id;
            this.RECORD_CITY(item.id);
            this.RECORD_CITYNAME(item.name);
            return false;
          }
        }
        this.cityName = '杭州市';
        this.currentCityId = 90;
        this.RECORD_CITY(90);
        this.RECORD_CITYNAME('杭州市');
      })
      .catch( err => {
        this.$vux.toast.text('获取城市列表失败', 'middle');
        this.currentCityId = 90;
        this.cityName = '杭州市';
        this.RECORD_CITY(90);
        this.RECORD_CITYNAME('杭州市');
      })
    }
  },
  mounted () {

    // 挂载完成隐藏loading
    this.$vux.loading.hide();
    let city_id = this.currentCityId ;
    getBanners( city_id )
      .then( res => {
        this.bannerimgs = res.result ;
      });

    let activityParams = {
      city_id : this.currentCityId,
      resource_type : 3, // 活动资源
      order_by : 'created_at',
      page : 1,
      pageSize : 30
    };
    getResources( initDataConfig(activityParams) )
      .then( res => {
        let arr = [] ;
        for( let item of res.result ){
          if(!item.expired){
            arr.push( item );
          }
        }
        this.recentActs = arr ;
      });
    getCase().then( res => {
      this.cases = res.result ;
    });
    getThemes( { city_id , page : 1 } ).then( res => {
      this.themes = res.result ;
    });
	  getCategory().then( res => {
	    this.fieldTypes = res.result;

    });
	// 操作顶部导航栏的背景色
    this.$refs.scroll.addEventListener( 'touchmove' , () => {
      let top = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
      let head = this.$refs.head ;
      let swiper = this.$refs.swiper ;
      let h = getStyle( swiper , 'height' ) - getStyle( head , 'height' );
      let n = top / h ;
      try{
        head.style.background = `rgba( 0,133,227 , ${ n*1 })`;
      }catch(err){}
      if( top <= 10 ){
        try{
          head.style.background = `rgba( 0,133,227,0)`;
        }catch(err){}
      }
    } , false );

  },
  methods : {
    ...mapMutations([
      'RECORD_CITYNAME',
      'RECORD_CITY',
      'ALL_CITYS'
    ]),
    goFields(arr){
      let ids = [];
      if(arr.length){
        for(let item of arr){
          ids.push( item.id )
        }
      }
      this.$router.push({path : '/fields' , query : { field_type_id : ids } });
    }
  }

}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin' ;

  .margin-bottom {
    margin-bottom: 1.2rem;
    background-color: $bgc;
  }

  /*公共*/
  .common-title{
    line-height: 0.47rem;
    font-size: 0.36rem;
    color: #282a2a;
  }
  .common-icon{
    display: inline-block;
    vertical-align: top;
    margin-right: 0.12rem;
    @include wh( 0.46rem , 0.47rem );
  }

  header {
    position: fixed;
    top:  0 ;
    left: 0;
    z-index: 1;
    padding: 0.1rem 0.24rem;
    line-height: 0.64rem;
    display: flex;
    width: 100%;
    justify-content: space-between;
    .drop {
      font-size: 0.3rem;
      .city-link {
        display: block;
        .cityct {
            color: $white;
        }
        .caret {
            display: inline-block;
            vertical-align: middle;
            margin: 0 0.1rem;
            @include wh( 0.26rem , 0.12rem );
            @include bg-image( "../../images/ic_drop-down_white_normal_three" );
        }
      }
    }
    .search {
      position: relative;
      @include wh( 5.55rem , 0.64rem );
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
        background-color: #fff;
      }
    }
  }
  .swiper {
      width: 100%;
      height: 3.2rem;
      overflow: hidden;
      .banners {
        img {
          width: 100%;
        }
      }
    }
  .tags {
      padding-bottom:0.3rem;
      background-color: #F5F5F5;
      .tag {
        margin-top: 0.3rem;
        font-size: 0.24rem;
        color: #666;
        p {
          margin-top: 0.08rem;
        }
        .fld{
            @include wh( 1.02rem , 1.02rem );
            @include bg-image( '../../images/ic_space_normal_three' );
        }
        .act{
            @include wh( 1.02rem , 1.02rem );
            @include bg-image( '../../images/ic_activity_normal_three' );

        }
        .adv{
            @include wh( 1.02rem , 1.02rem );
            @include bg-image( '../../images/ic_ad_normal_three' );
        }
        .map{
            @include wh( 1.02rem , 1.02rem );
            @include bg-image( '../../images/ic_map_one_normal_three' );
        }
        .mall{
            @include wh( 1.02rem , 1.02rem );
            @include bg-image( '../../images/ic_shopping-_mall_normal_three' );
        }
        .rdm{
            @include wh( 1.02rem , 1.02rem );
            @include bg-image( '../../images/ic_ordering_normal_three' );
        }
        .partnership{
            @include wh( 1.02rem , 1.02rem );
            @include bg-image( '../../images/ic_groups_normal_three' );
        }
        .invite{
            @include wh( 1.02rem , 1.02rem );
            @include bg-image( '../../images/ic_invitation_normal_three' );
        }
      }

    }
  .special {
    background-color: $white;
    .field{
      position: relative;
      padding: 0.3rem 0;
      text-align: center;
      .field-icon{
        @include bg-image( '../../images/ic_sitetype_one_normal_three' )
      }
      .more{
        position: absolute;
        top: 0.3rem;
        right: 0.1rem;
        @include sc(0.24rem,#999);
        display: flex;
        align-items: center;
        .icon{
          @include wh(0.44rem,0.44rem);
          @include bg-image('../../images/icon_more_gary');
        }
      }
    }
    .wrapBox {
      padding: 0 0 0.3rem 0.24rem;
      font-size: 0;
      overflow-x: scroll;
      .classifycontent {
        position: relative;
        display: flex;
        .field-item {
          width: 3.1rem;
          margin-right: 0.24rem;
          .field-type{
            display: block;
            position: relative;
            .field-img{
              @include wh( 100% , 3rem );
            }
          }
          .relative {
              position: relative;
              img {
                @include wh( 3.1rem , 3rem );
              }
              .time-box{
                position: absolute;
                bottom : 0;
                left: 0;
                width: 100%;
                height: 1rem;
                font-size: 0.24rem;
                color: #fff;
                background-image: linear-gradient( to bottom , rgba(0,0,0,0) , rgba(0,0,0,1)  );
                .time{
                  position: absolute;
                  bottom: 0.12rem;
                  left: 0;
                  width: 100%;
                  text-align: center;
                }
              }
            }
          .decript{
              padding: 0.16rem 0.16rem 0.2rem 0.16rem;
              @include bd-1px( #e5e5e5 );
              .common-field{
                  font-size: 0.24rem;
                  color: #282a2a;
              }
              .des-content{
                  margin-top: 0.24rem;
                .price-mark{
                    font-size: 0.24rem;
                    color: $red;
                }
                .price{
                    font-size: 0.36rem;
                    color: $red;
                }
                .price-next{
                    font-size: 0.24rem;
                    color: #999;
                }
              }
            }
          &.more{
            margin-right: 0;
            .field-type{
              display: block;
              width: 3.1rem;
              height: 3rem;
              padding-top: 1.1rem;
              text-align: center;
              font-size: 0.3rem;
              opacity: 0.5;
              background: #EDEEF5;
            }
          }
        }
      }
    }
  }
  .activity {
    position: relative;
    padding: 0.3rem 0;
    text-align: center;
    .activity-icon{
      @include bg-image( '../../images/ic_activity_one_normal_three' )
    }
    .more{
      position: absolute;
      top: 0.3rem;
      right: 0.1rem;
      @include sc(0.24rem,#999);
      display: flex;
      align-items: center;
      .icon{
        @include wh(0.44rem,0.44rem);
        @include bg-image('../../images/icon_more_gary');
      }
    }
  }
  .coord {
    background-color: #fff;
    padding: 0.3rem 0;
    .com{
      display: block;
      height: 2.38rem;
    }
    .prt{
      padding-right: 0.02rem;
    }
    .plt{
        padding-left: 0.02rem;
    }
    .day-specail{
      @extend .com ;
        margin-bottom: 0.04rem;
      @include bg-image('../../images/ic_sale_normal_three');
    }
    .new-field{
        @extend .com ;
        margin-bottom: 0.04rem;
        @include bg-image('../../images/ic_new_normal_three');
    }
    .good-service{
        @extend .com ;
        @include bg-image('../../images/ic_feature_normal_three');
    }
    .feature-show{
        @extend .com ;
        @include bg-image('../../images/ic_theme_normal_three');
    }
  }
  .themes{
    background-color: #fff;
    .title{
      padding: 0.3rem 0;
      text-align: center;
      position: relative;
      @include bb-1px(#e5e5e5);
      .themes-icon{
        @include bg-image( '../../images/ic_special_normal_three' )
      }
      .more{
        position: absolute;
        top: 0.3rem;
        right: 0.1rem;
        @include sc(0.24rem,#999);
        display: flex;
        align-items: center;
        .icon{
          @include wh(0.44rem,0.44rem);
          @include bg-image('../../images/icon_more_gary');
        }
      }
    }
    .themes-content{
      //.item{
      //  @include wh( 100% , 3.25rem );
      //  @include bb-1px(#e5e5e5);
      //  .item-link{
      //      display: block;
      //      @include wh( 100% , 3.25rem );
      //  }
      //  &.item-1{
      //    @include bg-image('../../images/ic_theme_one_noamal_three');
      //  }
      //  &.item-2{
      //      @include bg-image('../../images/ic_theme_two_noamal_three');
      //  }
      //  &.item-3{
      //      @include bg-image('../../images/ic_theme_three_noamal_three');
      //  }
      //}
        padding-bottom: 0.3rem;
       .themes-item{
         padding: 0.1rem 0.24rem;
         @include bb-1px(#e5e5e5);
         a{
           display: block;
           img{
             @include wh( 7.02rem , 3.05rem );
           }
         }
         &:last-child{
           padding: 0.1rem 0.24rem 0;
           @include bd-none;
         }
       }
    }
  }
  .case{
    background-color: #fff;
    .title{
      padding: 0.3rem 0;
      text-align: center;
      .case-icon{
        @include bg-image( '../../images/ic_cooperation_normal_three' )
      }
    }
    .case-content{
      padding: 0 0 0.3rem 0.24rem;
      font-size: 0;
      overflow-x: scroll;
      .case-box{
        display: flex;
        .case-item{
          @include wh( 4.64rem , 2.8rem );
          margin-right: 0.2rem;
          .item-link{
            display: block;
            .pic{
              @include wh( 100% , 2.8rem );
            }
          }
        }
      }

    }
  }
  .download{
    display: flex;
    align-items: center;
    margin-top: 0.2rem;
    @include wh( 100% , 1.2rem );
    padding: 0 0.24rem;
    font-size: 0.28rem;
    color: #666;
    background-color: #fff;
    .down-logo{
      @include wh( 1.2rem , 1.2rem );
      @include bg-image('../../images/ic_downlode_applogo_three');
    }
    .download-btn{
      @include wh( 2.08rem , 0.72rem );
      margin-left: 1.25rem;
      line-height: 0.72rem;
      background-color: $mainColor;
      border-radius: 0.08rem;
      >a{
        display: block;
        color: #fff;
        text-align: center;
      }
    }
    p {
      line-height: 0.4rem;
    }

  }
</style>
