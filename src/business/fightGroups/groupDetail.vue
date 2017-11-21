
<template>
  <div v-if="detail">
    <header class="transparent-header" ref="nav" id="head">
      <flexbox :gutter="0">
        <flexbox-item :span="1/3" class="transparent-left">
          <i class="back-icon" @click="$router.go(-1)"></i>
        </flexbox-item>
        <flexbox-item :span="1/3" class="ct">
          拼团详情
        </flexbox-item>
      </flexbox>
    </header>
    <div class="wrapBox" ref="swiper">
      <swiper loop dots-position="center" dots-class="custom-bottom" :aspect-ratio="440/750">
        <swiper-item v-for="( item , index ) in Imgs" :key="index">
          <div class="imgbox">
            <img v-lazy="item.pic_url" :data-srcset="item.pic_url | large" alt="场地图片" class="previewer-demo-img" @click.stop="show(index)">
          </div>
        </swiper-item>
      </swiper>
      <div class="typeposition">{{ detail.physical_resource.field_type.display_name }}</div>
    </div>
    <section class="join-info">
      <div class="price-box">
        <div class="real">
          <span class="price-pre">¥</span><span class="price-num">{{ detail.first_selling_resource_price.price/100 | twoPoint }}</span>
        </div>
        <div class="group-num">
          <del v-if="detail.group_purchase.origin_price">¥{{ detail.group_purchase.origin_price | twoPoint }}</del>
          <p class="join-group-box"><span class="people">{{ detail.group_purchase.number_of_group_purchase_now }}</span><span class="text">人已参团</span></p>
        </div>
      </div>
      <div class="date-box">
        <p class="text">结束倒计时</p>
        <div v-if="detail.group_purchase.time_left > 0">
          <clocker :time="detail.group_purchase.group_end" slot="value" class="countdown">
            <span class="day">%_D1%_D2</span><span class="point">:</span>
            <span class="day">%_H1%_H2</span><span class="point">:</span>
            <span class="day">%_M1%_M2</span><span class="point">:</span>
            <span class="day">%_S1%_S2</span>
          </clocker>
        </div>
        <div class="countdown" v-else>
          <span class="day">00</span><span class="point">:</span>
          <span class="day">00</span><span class="point">:</span>
          <span class="day">00</span><span class="point">:</span>
          <span class="day">00</span>
        </div>

      </div>
    </section>
    <section class="resource">
      <h3 class="resource-name ellipsis">{{ detail.physical_resource.name }}</h3>
      <p class="resource-people">
        <span>人流量：</span><span class="mg">{{ detail.physical_resource.number_of_people }}</span><span>付款人数：</span><span>{{ detail.physical_resource.number_of_order }}</span>
      </p>
      <div class="tag-box">
        <span class="tag-item" v-if="detail.physical_resource.age_level&&detail.physical_resource.age_level.display_name!='未填写'">{{ detail.physical_resource.age_level.display_name }}</span>
        <span class="tag-item" v-if="detail.physical_resource.consumption_level&&detail.physical_resource.consumption_level.display_name!='未填写'">消费能力{{ detail.physical_resource.consumption_level.display_name }}</span>
      </div>
      <div class="address">
        <div class="address-text">
          <p class="ellipsis name">{{ detail.physical_resource.community.district.name }}{{ detail.physical_resource.community.detailed_address }}</p>
          <p class="ellipsis jt-address">
            <span class="indoor" v-if="detail.physical_resource.indoor==1">室内</span>
            <span class="indoor" v-if="detail.physical_resource.indoor==0">室外</span>
            <span class="detail-addr"><span>具体位置：</span><span>{{ detail.physical_resource.doLocation }}</span></span>
          </p>
        </div>
        <div class="adress-icon">
          <span @click.stop="goMap( detail.physical_resource.community.lng ,detail.physical_resource.community.lat , detail.physical_resource.name )" class="icon"></span>
        </div>
      </div>
      <div class="gutter">
        <div class="btn-box">
          <flexbox :gutter="0">
            <flexbox-item :span="1/2" class="ct">
              <div class="jifen" @click="showJifen=true">
                <i class="btn-icon integral"></i><span>积分奖励</span>
              </div>
            </flexbox-item>

            <flexbox-item :span="1/2" class="ct">
              <div  @click="showErrorModel">
                <i class="btn-icon error"></i><span>纠错奖励</span>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </section>
    <section class="group-info">
      <div class="title">拼团信息</div>
      <div class="com-info">
        <div class="people-box">
          <div>
            <span class="com-info-tit">最少成团人数：</span><span class="com-info-cnt">{{ detail.group_purchase.min }}人</span>
          </div>
          <div>
            <span class="com-info-tit">最多成团人数：</span><span class="com-info-cnt">{{ detail.group_purchase.max }}人</span>
          </div>
        </div>
        <p class="com-info-item">
          <span class="com-info-tit">场地使用面积：</span><span class="com-info-cnt">{{ detail.group_purchase.field_length }}*{{ detail.group_purchase.field_width }}</span>
          <span class="desc-icon" @click="groupArea=true"></span>
        </p>
        <p class="com-info-item">
          <span class="com-info-tit">当前活动时间：</span><span class="com-info-cnt">{{ detail.group_purchase.activity_start }}-{{ detail.group_purchase.activity_end }}</span>
        </p>
        <p class="com-info-item" v-if="detail.group_purchase.activity_allow">
          <span class="com-info-tit">当前品类限制：</span><span class="com-info-cnt">{{ detail.group_purchase.activity_allow }}</span>
        </p>
        <p class="com-info-item" v-else>
          <span class="com-info-tit">当前禁止品类：</span><span class="com-info-cnt"></span>
        </p>
        <p class="com-info-item">
          <span class="com-info-tit">设施服务：</span>
        </p>
        <div class="has-server">
          <flexbox :gutter="0">
            <flexbox-item :span="1/6" class="item" v-if="detail.has_power">
              <span class="server-tag tag_1"></span>
            </flexbox-item>
            <flexbox-item :span="1/6" class="item" v-if="detail.has_chair">
              <span class="server-tag tag_2"></span>
            </flexbox-item>
            <flexbox-item :span="1/6" class="item" v-if="detail.has_tent">
              <span class="server-tag tag_3"></span>
            </flexbox-item>
            <flexbox-item :span="1/6" class="item" v-if="detail.leaflet">
              <span class="server-tag tag_4"></span>
            </flexbox-item>
            <!--<flexbox-item :span="1/6" class="item" v-if="detail.has_power">-->
              <!--<span class="server-tag tag_5"></span>-->
            <!--</flexbox-item>-->
            <flexbox-item :span="1/6" class="item" v-if="detail.overnight_material">
              <span class="server-tag tag_6"></span>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </section>
    <section class="res-detail" ref="resDetail">
      <tab :line-width=2 active-color='#0077FF' custom-bar-width='1.8rem' v-model="index">
        <tab-item>场地信息</tab-item>
        <tab-item>社区信息</tab-item>
      </tab>
      <swiper v-model="index" :aspect-ratio="39/75" :show-dots="false">
        <swiper-item>
          <div class="com-info">
            <p class="com-info-item">
              <span class="com-info-tit">摆摊时间：</span><span class="com-info-cnt">{{ detail.physical_resource.doBegin }}-{{detail.physical_resource.doFinish }}</span>
            </p>
            <p class="com-info-item">
              <span class="com-info-tit">场地面积：</span><span class="com-info-cnt">{{ detail.physical_resource.total_area }}m</span><sup>2</sup>
            </p>
            <p class="com-info-item">
              <span class="com-info-tit">物业要求：</span>
              <span class="com-info-cnt">
                <span v-if="detail.physical_resource.requirements.length" v-for="(requirement , index) in detail.physical_resource.requirements" :key="index">{{ requirement ? requirement.display_name : '' }}</span>
                <span>{{ detail.physical_resource.property_requirement }}</span>
              </span>
            </p>
            <p class="com-info-item">
              <span class="com-info-tit">禁摆品类：</span>
              <span class="com-info-cnt">
                <span v-if="detail.physical_resource.contraband.length" v-for="(band , index) in detail.physical_resource.contraband" :key="index">{{ band ? band.display_name : ''}}</span>
                <span>{{ detail.physical_resource.other_contraband }}</span>
              </span>
            </p>
            <p class="com-info-item">
              <span class="com-info-tit">流量高峰：</span><span class="com-info-cnt">{{ detail.physical_resource.peak_time ? detail.physical_resource.peak_time.display_name : '' }}</span>
            </p>
            <p class="com-info-item">
              <span class="com-info-tit">男女比例：</span><span class="com-info-cnt">男性{{ detail.physical_resource.male_proportion ? detail.physical_resource.male_proportion : '' }}%/女性{{ detail.physical_resource.male_proportion ? 100-detail.physical_resource.male_proportion : '' }}%</span>
            </p>
          </div>
        </swiper-item>
        <swiper-item>
          <div class="com-info">
            <p class="com-info-item">
              <span class="com-info-tit">社区名称：</span><span class="com-info-cnt">{{ detail.physical_resource.community.name }}</span>
            </p>
            <p class="com-info-item">
              <span class="com-info-tit">社区类型：</span><span class="com-info-cnt">{{ detail.physical_resource.community.community_type.display_name ? detail.physical_resource.community.community_type.display_name : '' }}</span>
            </p>
            <p class="com-info-item">
              <span class="com-info-tit">建成年份：</span><span class="com-info-cnt">{{ detail.physical_resource.community.build_year ? detail.physical_resource.community.build_year : '' }}年</span>
            </p>
            <p class="com-info-item">
              <span class="com-info-tit">户数：</span><span class="com-info-cnt">{{  detail.physical_resource.community.number_of_households }}</span>
            </p>
            <p class="com-info-item">
              <span class="com-info-tit">房价：</span><span class="com-info-cnt">{{ detail.physical_resource.community.house_price ? detail.physical_resource.community.house_price/100 : '' }}元/m</span><sup>2</sup>
            </p>
            <p class="com-info-item">
              <span class="com-info-tit">物业费：</span><span class="com-info-cnt">{{ detail.physical_resource.community.property_costs ? detail.physical_resource.community.property_costs/100 : '' }}元/m*月</span>
            </p>
          </div>
        </swiper-item>
      </swiper>
      <div class="gutter">
        <router-link :to="{name:'groupInfo'}" class="view-all"><span class="view-text">查看所有信息</span><span class="cert-icon"></span></router-link>
      </div>
    </section>
    <section class="other-res" v-if="otherGroup.length">
      <div class="res-tit">其他火爆拼团</div>
      <div class="list-wraper" v-if="otherGroup">

          <ul class="list" :style="{ width : otherGroup.length*4.48 + 'rem' }">
            <li class="res-item" v-for="(item,index) in otherGroup" :key="index">
              <router-link :to="{ name: 'groupDetail' , params : {id:item.id} }">
                <div class="img-box">
                  <img v-lazy="item.selling_resource.physical_resource.physical_resource_first_img.pic_url"
                       :data-srcset="item.selling_resource.physical_resource.physical_resource_first_img.pic_url | half"
                       alt="资源图片">
                  <div class="date">
                    <!--<span>{{ item.group_start | timeFormat }}-{{ item.group_end | timeFormat }}</span>-->
                    <span>已参团{{ item.number_of_group_purchase_now }}人</span>
                  </div>
                </div>
                <div class="text-info">
                  <p class="tit ellipsis">{{ item.selling_resource.physical_resource.name }}</p>
                  <p class="price-box"><span class="price-pre">¥</span><span class="price-num">{{ item.selling_resource.first_selling_resource_price.price/100 | twoPoint }}</span><span class="silver">起</span></p>
                </div>
              </router-link>
            </li>
          </ul>

      </div>
    </section>
    <section class="comments" ref="comment">
      <div class="comment-tit" @click.stop="toComments(comments.length)">
        <span>评价({{ comments.length }})</span>
        <span class="cert-icon"></span>
      </div>
      <ul class="comment-list" v-if="comments.length">
        <li class="comment-item" v-for="(item ,index) in comments" :key="index" v-if="index<3">
          <div class="comment-name">
            <div class="name">{{ item.name }}</div>
            <div class="star">
              <star :score="item.score" :size="24"></star>
            </div>
          </div>
          <p class="comment-date">
            <span>{{ item.reviewed_at }}</span><span class="ml">现场人流量：</span><span>{{ item.people_flow }}</span>
          </p>
          <p class="comment-desc" v-if="item.content">{{ item.content }}</p>
          <div class="img-box" v-if="item.images.length">
            <img v-lazy="img" alt="评论图片" v-for="( img , index) in item.images" :key="index">
          </div>
        </li>
      </ul>
    </section>
    <section class="bottom-nav">
      <div class="server" @click.stop="showServer"><span class="server-icon"></span></div>
      <div class="group-btn" @click.stop="goGroup" v-if="detail.group_purchase.number_of_group_purchase_now < detail.group_purchase.max && detail.group_purchase.time_left > 0">
        <span class="price-pre">¥</span><span class="price-num">{{ detail.first_selling_resource_price.price/100 | twoPoint }}</span>
        <span class="now-join">立即参团</span>
      </div>
      <div class="full-group" v-else-if="detail.group_purchase.number_of_group_purchase_now >= detail.group_purchase.max && detail.group_purchase.time_left > 0">
        已满员
      </div>
      <div class="disabled-group" v-else="detail.group_purchase.time_left < 0">
        拼团结束
      </div>
    </section>

    <mend v-if="error" :res_name="detail.physical_resource.name" @close="close" :resource_id="act_id"></mend>
    <div v-transfer-dom>
      <confirm
        v-model="queryModel"
        :close-on-confirm="false"
        title="登录后可以查看更多，是否登录?"
        @on-confirm="onConfirm">
      </confirm>
    </div>
    <div v-transfer-dom>
      <previewer :list="imgList" ref="previewer"></previewer>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="viewMoreGroup"
        title="来晚一步哟，此团已结束"
        @on-confirm="onViewMoreGroup"
        confirm-text="查看其他拼团"
      >

      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="hasGroup"
        title="您已参团，确认再次参团吗？"
        @on-confirm="onHasGroup">
      </confirm>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="showJifen">
        <div class="jifen-wraper">
          <div class="img-box">
            <img src="../../images/ic_blue_logo_three@2x.png" alt="a" class="img">
          </div>
          <h3 class="title">积分奖励</h3>
          <div class="text-info lt">
            预定该场地，即可获得与下单支付金额同等数值的积分！
          </div>
          <div class="close" @click="showJifen=false"></div>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="groupArea">
        <div class="jifen-wraper">
          <div class="img-box">
            <img src="../../images/ic_blue_logo_three@2x.png" alt="a" class="img">
          </div>
          <h3 class="title">拼团场地说明</h3>
          <div class="text-info lt">
            1.拼团场地，所有参团人员将一起共同使用场地资源。<br>
            2.每位成员可以使用的场地面积：{{ detail.group_purchase.field_length }}*{{ detail.group_purchase.field_width }}左右，届时请以现场物业分配为准。
          </div>
          <div class="close" @click="groupArea=false"></div>
        </div>
      </x-dialog>
    </div>
    <!--子路由-->
    <transition name="router-slide" mode="out-in">
      <router-view :physicalResource="detail.physical_resource" :community="detail.physical_resource.community"></router-view>
    </transition>
  </div>
</template>
<script>
  import star from 'src/components/star';
  import mend from 'src/components/mend';
  import { Swiper , XDialog  , SwiperItem , Flexbox , FlexboxItem , Tab , TabItem ,Clocker ,Confirm,Previewer, TransferDomDirective as TransferDom } from 'vux';
  import { getGroupDetail , getResourcesComments ,getGroupList , getGroupStatus } from 'src/service/getData';
  import { large , twoPoint , half ,timeFormat } from 'src/filters';
  import { getStorage , setStorage , getStyle , getSession ,setSession } from 'src/config/tools';
  export default {
    directives: {
      TransferDom
    },
    data () {
      return {
        detail : null , // 详情
        Imgs : null , // 轮播图
        imgList : [] , // 查看大图
        comments : [] , // 评价列表
        act_id : '' , // 售卖资源id
        queryModel : false , // 登录提示框
        city_id : this.$store.state.city_id || getStorage( 'cityId' ) || this.$route.query.city_id  ||90 ,

        otherGroup : null , // 其他火爆拼团
        weather : null ,// 天气数据
        showDrop : false , // 右侧下拉框
        collected : false , // 是否收藏
        secondIndex : 0, // 次级导航选中
        index : 0,  // 场地信息tab栏
        secondNav : false , // 二级导航出现
        dateArr : [], // 日期数组
        showModel : true , // 是否显示时间框
        sellInfo : null , // 售卖资源信息

        viewMoreGroup : false ,
        hasGroup : false ,
        // 暂时数据
        indoor : false ,
        self : false,

        groupArea : false ,
        showJifen : false ,// 积分弹窗
        error : false // 纠错弹窗
      }
    },
    created(){

    },
    components : {
      Swiper,
      SwiperItem,
      Flexbox,
      FlexboxItem,
      Tab ,
      TabItem,
      Clocker,Confirm,Previewer,XDialog,mend
    },
    mounted() {

      let id = this.$route.params.id ;
      getGroupDetail(id).then(res => {
        this.detail = res.result ;
        this.Imgs = this.detail.physical_resource.physical_resource_imgs ;
        this.act_id = res.result.first_selling_resource_price.selling_resource_id ;
        this.sellInfo = res.result.first_selling_resource_price;

        let arr = [];
        for(let item of this.Imgs){
          let obj = {} ;
          obj.src = item.pic_url ;
          arr.push(obj);
        }
        this.imgList = arr ;
      }).catch(err => {});
      if(this.act_id){
        let id = this.act_id ;
        let obj = {
          page : 1,
          pageSize : 10
        } ;
        getResourcesComments( id , obj ).then(res => {
          this.comments =  res.result;
        }).catch(err => {});
      }
      let params = {
        page : 1 ,
        pageSize : 10,
        city_id : this.city_id,
        group_purchase_id : +id
      };
      getGroupList( params ).then( res => {
        this.otherGroup = res.result.data ;
      }).catch(err => {});
      // 操作顶部导航栏的背景色
      window.addEventListener( 'touchmove' , () => {
        let top = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
        let swiper = this.$refs.swiper ;
        let head = this.$refs.nav ;
        let h = getStyle( swiper , 'height' ) - getStyle( head , 'height');
        let n = top / h ;
        try{
          head.style.background = `rgba( 255,255,255 , ${ n*1 })`;
          head.className = 'transparent-header scroll' ;
        }catch (err){}
        if( top <= 10 ){
          try{
            head.style.background = 'rgba( 255,255,255 , 0)';
            head.className = 'transparent-header' ;
          }catch(err){}
        }
      } , false);
      window.addEventListener( 'scroll' , () => {
        let top = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
        let swiper = this.$refs.swiper ;
        let head = this.$refs.nav ;
        let h = getStyle( swiper , 'height' ) - getStyle( head , 'height');
        let n = top / h ;
        try{
          head.style.background = `rgba( 255,255,255 , ${ n*1 })`;
          head.className = 'transparent-header scroll' ;
        }catch (err){}
        if( top <= 10 ){
          try{
            head.style.background = 'rgba( 255,255,255 , 0)';
            head.className = 'transparent-header' ;
          }catch(err){}
        }
      } , false);
    },
    filters :{
      large , twoPoint , half ,timeFormat
    },
    methods : {
      toComments(n){
        if(n<=3){
          return ;
        }
        let login = getSession('login') ;
        if( !login ){
          this.queryModel = true ;
        }else{
          let id = this.$route.params.id ;
          this.$router.push({name : 'commentDetail' , params : { id : id }});
        }

      },
      onConfirm(){
        this.$router.push('/login');
      },
      goMap(lng , lat , name ){
        // 去地图锚点
        this.$router.push({path : '/singlePosition' , query : { lng : lng , lat : lat , fieldName : encodeURIComponent(name) } })
      },
      showServer(){
        _MEIQIA('showPanel');
      },
      collect(){
        //心亮起来
        this.collected = !this.collected ;
      },
      selectedDate(obj){
        if( obj.length ){
          this.dateArr = obj ;
        }
      },
      closeDateModel(){
        this.showModel = false ;
      },
      show(index){
        this.$refs.previewer.show(index) ;
      },
      onViewMoreGroup(){
        this.$router.push('/group');
      },
      onHasGroup(){
        let arr = [{
          id : this.act_id ,
          size : this.sellInfo.size ,
          lease_term_type_id: 1 ,
          count : 1, // 资源数量(场地资源直接传入1即可，拼团也传1)
          count_of_time_unit : 1, // 时间单位数量(e.g. 3周, 3个季度, 场地资源直接传入1即可，拼团也传1)
          custom_dimension : '' ,
          date : this.detail.group_purchase.activity_start , // 选择的日期数组
          lease_term_type_name: '天' ,
          name :  this.detail.physical_resource.name , // 场地名
          field_type : '拼团' ,
          pic_url : this.imgList[0].src ,  // 图片
          leaveWorld : '', // 留言
          deposit : 0 , // 押金
          discount_price : 0, // 折扣金额
          price : this.sellInfo.price // 金额
        }];
        // 下单的resource存入session
        setSession('orderResource' ,{ resource : arr , cart_item_ids : null , group : true });
        this.$router.push('/submitOrder');
      },
      goGroup(){

        let login = getSession('login') ;
        if(!login){
          this.$router.push({ path : '/login' , query : {redirect : this.$route.fullPath }} );
          return false ;
        }
        let id = this.$route.params.id ;
        getGroupStatus(id).then( res => {
          if(res.result.flag == 0){
            // 第一次参团调结算页
            let arr = [{
              id : this.act_id ,
              size : this.sellInfo.size ,
              lease_term_type_id: 1 ,
              count : 1, // 资源数量(场地资源直接传入1即可，拼团也传1)
              count_of_time_unit : 1, // 时间单位数量(e.g. 3周, 3个季度, 场地资源直接传入1即可，拼团也传1)
              custom_dimension : '' ,
              date : this.detail.group_purchase.activity_start , // 选择的日期数组
              lease_term_type_name: '天' ,
              name :  this.detail.physical_resource.name , // 场地名
              field_type : '拼团' ,
              pic_url : this.imgList[0].src ,  // 图片
              leaveWorld : '', // 留言
              deposit : 0 , // 押金
              discount_price : 0, // 折扣金额
              price : this.sellInfo.price // 金额
            }];
            // 下单的resource存入session
            setSession('orderResource' ,{ resource : arr , cart_item_ids : null , group : true });
            this.$router.push('/submitOrder');
          }else if(res.result.flag == 1){
            this.hasGroup = true ;
          }else{
            // 来晚一步
            this.viewMoreGroup = true ;
          }
        }).catch( err => {
          if( err.code == -99 ){
            this.$router.push({ path : '/login' , query : {redirect : this.$route.fullPath }} );
            return false ;
          }
        })
      },
      showErrorModel (){
        this.error = true ;
      },
      close(){
        this.error = false ;
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../style/mixin' ;
  .router-slide-enter-active, .router-slide-leave-active {
    transition: all 0.4s;
  }
  .router-slide-enter, .router-slide-leave-active {
    transform: translateX( 100% );
    opacity: 0;
  }

  .jifen-wraper{
    padding: 0 0.35rem 0.25rem;
    .img-box{
      height: 1.6rem;
      .img{
        width: 1.6rem;
        height: 1.6rem;
        margin: -0.8rem auto 0.2rem ;
      }
    }
    .title{
      margin-top: 0.2rem;
      text-align: center;
      font-size: 0.34rem;
      color: #333;
      font-weight: normal;
    }
    .text-info{
      margin-top: 0.35rem;
      line-height: 0.5rem;
      font-size: 0.3rem;
      color: #999;
    }
    .close{
      position: fixed;
      left: 50%;
      bottom: -1.5rem;
      width: 0.86rem;
      height: 0.86rem;
      transform: translateX(-50%);
      @include bg-image('../../images/ic_closee_white');
    }
  }

  .com-info{
    padding: 0.15rem 0.24rem;
    .people-box{
      display: flex;
      justify-content: space-between;
      line-height: 0.6rem;
    }
    .com-info-item{
      height: 0.6rem;
      line-height: 0.6rem;
    }
    .com-info-tit{
      font-size: 0.3rem;
      color: #999;
    }
    .com-info-cnt{
      font-size: 0.3rem;
      color: $fontColor;
    }
    .desc-icon{
      display: inline-block;
      vertical-align: middle;
      @include wh(0.44rem,0.44rem);
      @include bg-image('../../images/ic_tips ');
    }
  }

  .transparent-header{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 0.88rem;
    padding: 0 0.24rem;
    background-color: transparent;
    .transparent-left{
      @include wh( 0.48rem , 0.48rem );
      margin-top: 0.2rem;
      .back-icon{
        display: inline-block;
        @include wh( 0.48rem , 0.48rem );
        @include bg-image('../../images/nav_ic_back_white');
      }
    }
    .ct{
      font-size: 0;
    }
    .transparent-right{
      position: relative;
      @include wh( 1.38rem , 0.48rem );
      text-align: right;
      font-size: 0;
      .car-icon{
        display: inline-block;
        @include wh( 0.48rem , 0.48rem );
        margin-right: 0.44rem;
        @include bg-image('../../images/nav_ic_shopping _white');
      }
      .sys-icon{
        display: inline-block;
        @include wh( 0.46rem , 0.46rem );
        @include bg-image('../../images/nav_ic_more_white');
      }
    }
    .dropdown{
      position: absolute;
      top: 0.68rem;
      right: 0;
      @include wh( 2.1rem , 2.09rem );
      padding-top: 0.08rem;
      @include bg-image('../../images/ic_bg_select_popup_three');
      ul {
        padding: 0 0.3rem;
        .drop-item {
          height: 1rem ;
          line-height: 1rem;
          font-size: 0.26rem;
          >span{
            display: inline-block;
            @include wh( 1.06rem , 100% );
            text-align: center;
          }
          .heart-icon{
            display: inline-block;
            vertical-align: middle;
            @include wh( 0.44rem , 0.44rem );
            @include bg-image('../../images/popup_ic_collection');
            &.on{
              @include bg-image('../../images/ic_collection_red');
            }
          }
          .server-icon{
            display: inline-block;
            vertical-align: middle;
            @include wh( 0.44rem , 0.44rem );
            @include bg-image('../../images/popup_ic_service');
          }
          .collect{
            @include bb-1px(#e8e8e8);
          }
        }
      }

    }
    &.scroll{
      .ct{
        font-size: 0.36rem;
      }
      .back-icon{
        @include bg-image('../../images/ic_back_black');
      }
      .car-icon{
        @include bg-image('../../images/nav_ic_shopping _black');
      }
      .sys-icon{
        display: inline-block;
        @include wh( 0.46rem , 0.46rem );
        @include bg-image('../../images/ic_more_black');
      }
    }
  }
  .wrapBox {
    position: relative;
    top: 0;
    left:0;
    background-color: #fff;
    .imgbox {
      img {
        width: 100%;
        height: 4.4rem;
      }
    }
    .typeposition {
      position: absolute;
      bottom: 0.26rem;
      left: 0.26rem;
      @include wh ( 1rem , 0.42rem );
      line-height: 0.42rem;
      border-radius: 0.04rem;
      border: 1px solid #fff;
      font-size: 0.22rem;
      text-align: center;
      color: $white;
      background-color: transparent;
    }
  }
  .join-info{
    height: 1.2rem;
    display: flex;
    .price-box{
      display: flex;
      justify-content: space-between;
      width: 4.88rem;
      padding: 0.28rem 0 0.28rem 0.2rem;
      background-color: $red;
      .real{
        margin-right: 0.18rem;
        .price-pre{
          color: #fff;
          font-size: 0.36rem;
        }
        .price-num{
          color: #fff;
          font-size: 0.72rem;
          letter-spacing: -0.04rem;
        }
      }
      .group-num{
        del{
          font-size: 0.24rem;
          opacity: 0.5;
          color: #FFFFFF;
          letter-spacing: 0;
        }
        .join-group-box{
          margin-top: 0.06rem;
          padding: 0 0.06rem;
          background: rgba(0,0,0,0.1);
          border-radius: 0.02rem;
          .people{
            font-size: 0.26rem;
            color: #fff;
          }
          .text{
            opacity: 0.7;
            font-size: 0.22rem;
            color: #FFFFFF;
          }
        }

      }
    }
    .date-box{
      width: 2.6rem;
      padding: 0.22rem 0.35rem;
      background-color: $yellow;
      font-size: 0.22rem;
      line-height: 1;
      .text{
        text-align: center;
        color: $red;
      }
      .countdown{
        margin-top: 0.22rem;
        font-size: 0.22rem;
        color: #fff;
        .day{
          display: inline-block;
          vertical-align: middle;
          @include wh( 0.32rem,0.32rem );
          line-height: 0.32rem;
          text-align: center;
          background-color: rgba(0,0,0,0.9);
          border-radius: 0.04rem;
        }
        .point{
          margin-left: 0.06rem;
        }
      }
    }
  }
  .resource{
    line-height: 1;
    background-color: #fff;
    overflow: hidden;
    .resource-name{
      padding: 0 0.24rem;
      margin-top: 0.3rem;
      font-size: 0.4rem;
      color: #1E1E1E;
      letter-spacing: 0;
    }
    .resource-people{
      margin-top: 0.2rem;
      padding: 0 0.24rem;
      font-size: 0.22rem;
      color: #666;
      .mg{
        margin-right: 0.3rem;
      }
    }
    .tag-box{
      padding: 0 0.24rem;
      font-size: 0;
      .tag-item{
        display: inline-block;
        height: 0.4rem;
        line-height: 0.4rem;
        padding: 0 0.2rem;
        margin: 0.3rem 0.2rem 0.3rem 0;
        font-size: 0.22rem;
        color: $orange ;
        background-color: rgba(255,102,0 , 0.1);
        &:last-child{
          margin-right: 0;
        }
      }
    }
    .address{
      display: flex;
      padding: 0.3rem 0.24rem;
      background-color: #fafafa;
      .address-text{
        width: 6.4rem;
        border-right: 1px solid rgba(0,0,0,0.06);
        .name{
          font-size: 0.28rem;
        }
        .jt-address{
          margin-top: 0.18rem;
          font-size: 0;
          .indoor{
            display: inline-block;
            height: 0.3rem;
            line-height: 0.3rem;
            padding: 0 0.1rem;
            margin-right: 0.1rem;
            border: 1px solid $mainColor;
            border-radius: 0.04rem;
            font-size: 0.2rem;
            color: $mainColor;
          }
          .detail-addr{
            font-size: 0.24rem;
            color: #666;
            overflow: hidden;
          }
        }
      }
      .adress-icon{
        width: 0.6rem;
        text-align: right;
        .icon{
          display: inline-block;
          vertical-align: top;
          margin-top: 0.16rem;
          @include wh( 0.44rem , 0.44rem );
          @include bg-image('../../images/ic_location');
        }
      }
    }
    .gutter{
      background-color: #fafafa;
      .btn-box{
        padding: 0.22rem 0;
        border-top: 1px solid rgba(0,0,0,0.06);
        font-size: 0.22rem;
        color: #666;
        .ct{
          height: 0.4rem;
          line-height: 0.4rem;
          &.promise-item{
            border-left: 1px solid rgba(0,0,0,0.06);
            border-right: 1px solid rgba(0,0,0,0.06);
          }
          .btn-icon{
            display: inline-block;
            vertical-align: middle;
            @include wh( 0.34rem , 0.34rem );
            margin-right: 0.06rem;
            &.integral{
              @include bg-image('../../images/ic_gold');
            }
            &.promise{
              @include bg-image('../../images/ic_refund');
            }
            &.error{
              @include bg-image('../../images/ic_money');
            }
          }
        }
        .jifen{
          border-right: 1px solid #e8e8e8;
        }
      }
    }

  }
  .group-info{
    margin-top: 0.2rem;
    background-color: #fff;
    .title{
      padding-left: 0.24rem ;
      height: 0.92rem;
      border-bottom: 1px solid rgba(0,0,0,0.06);
      line-height: 0.92rem;
      font-size: 0.34rem;
    }
    .has-server{
      margin: 0 -0.24rem;
      .item{
        position: relative;
        top: 0;
        left: 0;
        height: 1.08rem;
        .server-tag{
          position: absolute;
          top: 50%;
          left: 50%;
          height: 0.68rem;
          transform: translate(-50% , -50%);
          &.tag_1{
            width: 0.4rem;
            @include bg-image('../../images/ic_electric');
          }
          &.tag_2{
            width: 0.4rem;
            @include bg-image('../../images/icon_chair');
          }
          &.tag_3{
            width: 0.4rem;
            @include bg-image('../../images/ic_tent');
          }
          &.tag_4{
            width: 0.78rem;
            @include bg-image('../../images/ic_leaflets');
          }
          &.tag_5{
            width: 0.4rem;
            @include bg-image('../../images/ic_invoice');
          }
          &.tag_6{
            width: 0.8rem;
            @include bg-image('../../images/ic_materiel');
          }
        }
      }
    }
  }
  .res-detail{
    margin-top: 0.2rem;
    padding-bottom: 0.3rem;
    background-color: #fff;

    .gutter{
      .view-all{
        display: block;
        height: 0.86rem;
        line-height: 0.86rem;
        font-size: 0.24rem;
        text-align: center;
        color: $mainColor;
        background-color: #f8f8f8;
        .view-text{
          margin-right: 0.06rem;
        }
        .cert-icon{
          display: inline-block;
          vertical-align: middle;
          @include wh( 0.24rem , 0.24rem );
          @include bg-image('../../images/ic_open_blue');
        }
      }
    }
    /*tab栏重置样式*/
    .vux-tab{
      height: 0.94rem;
    }
    .vux-tab .vux-tab-item{
      flex: 1;
      line-height: 0.94rem;
      font-size: 0.28rem;
      color: #999;
    }
    .vux-tab .vux-tab-item.vux-tab-selected{
      font-size: 0.34rem;
      color: #282A2A!important;
    }
  }
  .other-res{
    margin-top: 0.2rem;
    background-color: #fff;
    .res-tit{
      height: 0.94rem;
      line-height: 0.94rem;
      padding: 0 0.24rem;
      font-size: 0.34rem;
      color: #1E1E1E;
    }
    .list-wraper{
      height: 4.32rem;
      overflow-x: scroll;
      .list{
        display: flex;
        margin-left: 0.2rem;
        .res-item{
          width: 4.28rem;
          margin-right: 0.2rem;
          >a{
            display: block;
          }
          .img-box{
            position: relative;
            top: 0;
            left: 0;
            >img{
              @include wh(4.28rem ,3rem)
            }
            .date{
              position: absolute;
              bottom: 0;
              left: 0;
              @include wh( 100% , 0.4rem );
              padding-left: 0.1rem;
              line-height: 0.4rem;
              font-size: 0.22rem;
              color: #fff;
            }
          }
          .text-info{
            .tit{
              margin-top: 0.2rem;
              font-size: 0.3rem;
              color: #1E1E1E;
            }
            .price-box{
              margin-top: 0.2rem;
              .price-pre{
                font-size: 0.22rem;
                color: $red;
              }
              .price-num{
                font-size: 0.34rem;
                color: $red;
              }
              .silver{
                font-size: 0.22rem;
                color: #999;
              }
            }
          }
        }
      }

    }
  }
  .comments{
    margin-top: 0.2rem;
    padding-bottom: 1rem;
    background-color: #fff;
    .comment-tit{
      display: flex;
      justify-content: space-between;
      padding: 0 0.24rem;
      height: 0.94rem;
      line-height: 0.94rem;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      font-size: 0.34rem;
      color: #1E1E1E;
      .cert-icon{
        display: inline-block;
        margin-top: 0.25rem;
        @include wh( 0.44rem , 0.44rem );
        @include bg-image('../../images/icon_more_gary');
      }
    }
    .comment-list{
      .comment-item{
        padding: 0.3rem 0.24rem;
        .comment-name{
          display: flex;
          justify-content: space-between;
          font-size: 0.28rem;
          color: #666;
        }
        .comment-date{
          margin-top: 0.15rem;
          font-size: 0.24rem;
          color: #999;
          .ml{
            margin-left: 0.2rem;
          }
        }
        .comment-desc{
          padding: 0.3rem 0;
          font-size: 0.3rem;
          color: #1E1E1E;
        }
        .img-box{
          display: flex;
          >img{
            @include wh( 1.6rem , 1.6rem );
            margin-right: 0.2rem;
            &:last-child{
              margin-right: 0;
            }
          }
        }
      }

    }
  }
  .bottom-nav{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    height: 1rem;
    line-height: 1rem;
    border-top: 1px solid rgba(0,0,0,0.1);
    text-align: center;
    .server{
      width: 1.86rem;
      background-color: #fff;
      .server-icon{
        display: inline-block;
        vertical-align: middle;
        @include wh( 0.48rem, 0.48rem );
        @include bg-image('../../images/tab_ic_service');
      }
    }
    .group-btn{
      width: 5.63rem;
      color: #fff;
      background-color: $red;
      font-size: 0;
      .price-pre{
        margin-right: 0.02rem;
        font-size: 0.24rem;
      }
      .price-num{
        margin-right: 0.14rem;
        font-size: 0.34rem;
      }
      .now-join{
        font-size: 0.34rem;
      }
    }
    .full-group{
      width: 5.63rem;
      font-size: 0.3rem;
      color: #bbb;
      background-color: #DDD;
    }
    .disabled-group{
      width: 5.63rem;
      font-size: 0.3rem;
      color: #bbb;
      background-color: #DDD;
    }
  }

</style>

