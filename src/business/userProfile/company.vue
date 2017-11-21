<template lang="html">
  <div class="company">
      <v-head go-back="true" isFixed="true">
        <div slot="center-part">公司信息</div>
      </v-head>
      <section class="C-main">
        <ul class="C-list">

          <li class="C-item no-angle">
            <span class="tit"><i class="require-icon">*</i>公司名称</span>
            <input class="input" type="text" v-model="companyInfo.company" placeholder="请输入公司名称" maxlength="100"/>
          </li>
          <li class="C-item no-angle">
            <span class="tit"><i class="require-icon">*</i>产品名称</span>
            <input class="input" type="text" v-model="companyInfo.product" placeholder="请输入公司名称" maxlength="100"/>
          </li>

          <li class="C-item">
              <i class="require-icon">*</i>
              <popup-picker class="picker" title="行业选择" value-text-align="left" :columns="2" :show-name="true"  :placeholder="companyInfo.industry_name||'请选择'"  v-model="industry_selected" :data="industry"  @on-change="chooseIndustry"></popup-picker>
          </li>
         <li class="C-item">
           <i class="require-icon">*</i>
            <popup-picker value-text-align="left" :columns="1" :show-name="true" title="推广形式" :placeholder="companyInfo.spread_way ? companyInfo.spread_way.spread_way : ''" :data="spreadway" v-model="spread_way_id" @on-change="changeSpreadWay"></popup-picker>
          </li>
           <li class="C-item no-angle">
            <span class="tit">需求面积</span>
            <input class="input deman-input" type="number"  v-model.number="companyInfo.demand_area" placeholder="请输入常用摆摊面积" maxlength="16"/>
            <span class="tit">m²</span>
          </li>
           <li v-if="companyInfo.pushing_frequency_level&&companyInfo.pushing_frequency_level" class="C-item">
            <popup-picker value-text-align="left" :columns="1" :show-name="true" title="频　　率" :placeholder="companyInfo.pushing_frequency_level.display_name" :data="pushfrequency" v-model="pushfrequency_id" @on-change="changePushingFrequencyLevel"></popup-picker>
          </li>
           <li class="C-item no-angle item-two">
            <span class="tit">单场接受的价格区间</span>
            <div class="tags price-area">
              <input class="input price-input" type="number" v-model.number="companyInfo.acceptable_minimum_price" placeholder="最低价" maxlength="16"/>-
              <input class="input price-input" type="number" v-model.number="companyInfo.acceptable_maximum_price" placeholder="最高价" maxlength="16"/>
              <span class="tit">m²</span>
            </div>

          </li>
          <li class="C-item no-angle item-two">
            <span class="tit">用户消费水平</span>
            <div class="tags consumption-level-tags">

              <div @click="selectedItem(item)" class="tag"
                :class="{ active : item.flag }" :key="index"
                v-for="(item,index) in consumptionLevel">{{item.display_name}}</div>
            </div>
          </li>

          <li class="C-item no-angle item-two">
            <span class="tit">年龄层</span>
            <div class="tags age-level-tags">
              <span class="tag" :class="{ active : item.flag }" v-for="item in agelevel" :key="item.id" @click="selectedItem( item )">{{ item.display_name }}</span>
            </div>
          </li>
           <li class="C-item no-angle item-two">
            <span class="tit">其他用户特征</span>
            <textarea class="textarea" v-model="companyInfo.feature_description" placeholder="请描述其他用户特征。"  maxlength="2000"></textarea>
          </li>
          <li class="C-item no-angle item-two">
            <span class="tit">上传地推照片<span class="txt">(最多3张)</span></span>
            <div class="">
               <vUploadImg name="img2" :picArr="companyInfo.images" max=3 region='z0' fileType="cert"></vUploadImg>
            </div>
          </li>
           <li class="C-item no-angle item-two">
            <span class="tit">上传营业执照<span class="txt">(仅可穿1张)</span></span>
            <div class="">
               <vUploadImg name="img1" :picArr="cert_url" max=1 region='z0' fileType="cert"></vUploadImg>
            </div>
          </li>

           <li v-show="is_food_induatry" class="C-item no-angle item-two">
            <span class="tit">上传食品安全许可证<span class="txt">(最多3张)</span></span>
            <!-- <div class="tags field-image">
              <img v-for="(item,index) in companyInfo.food_safety_license" :src="item" />
              <div v-show="companyInfo.food_safety_license&&companyInfo.food_safety_license.length<3" class="ic-camera">
              </div>
            </div> -->
             <div class="">
               <vUploadImg name="img3" :picArr="companyInfo.food_safety_license" max=3 region='z0' fileType="cert"></vUploadImg>
            </div>
          </li>
        </ul>
        <div @click="save"  class="save" >保存</div>
      </section>

       <transition name="router-slid" mode="out-in">
        <router-view @industry="chooseIndustry"></router-view>
      </transition>
  </div>
</template>
<script>
import vHead from 'src/components/vHead'
import vUploadImg from 'src/components/vUploadImg';
import { Icon, PopupPicker } from 'vux'
import { mapState, mapActions } from 'vuex'
import { getCompanyInfo, getDemandInfo, postCompanyInfo ,getIndustry} from 'src/service/getData';
import { getStorage, getSession } from 'src/config/tools';
import { twoPoint } from 'src/filters'
export default {
  data() {
    return {
      info: {},
      companyInfo: {},
      consumptionLevel: [],
      agelevel: [],
      pushfrequency: [],
      pushfrequency_id:[],
      leasetermtype: [],
      spreadway: [],
      spread_way_id: [], // 推广形式id
      catering_industry_id:[],
      is_food_induatry:'',
      industry: [],//行业
      industry_id:undefined,
      industry_selected: [],//选择的行业 父、子级ids  [parentid,children]
      qiniuToken: '',
      cert_url:[]
    }
  },
  components: { vHead, Icon, PopupPicker ,vUploadImg},
  filters: {
    twoPoint
  },
  watch:{
    /* industry_selected: function(val, oldVal) {
            this.industry_id = val[1] * 1;
        }, */
  },
  computed: {
    ...mapState([
      'userProfile'
    ]),
  },

  mounted() {
    this.initData()
  },
  methods: {
    ...mapActions([
      'getUserProfile'
    ]),
    initData() {
       getCompanyInfo().then(res => {

        this.companyInfo = res.result;
        this.cert_url = [this.companyInfo.cert_url+'']
        getDemandInfo().then(res => {
          // this.info =JSON.parse(JSON.stringify(res.result))
          this.catering_industry_id =  res.result.catering_industry_id;
          this.consumptionLevel = this.changeSelectData(res.result.consumptionlevel);
          this.agelevel = this.changeSelectData(res.result.agelevel);
          this.pushfrequency = this.changeData(res.result.pushfrequency);
          this.leasetermtype = this.changeData(res.result.leasetermtype);
          this.spreadway = this.changeData(res.result.spreadway);
          this.choseLevel();
          this.isFoodInduatry()
        })

      });
      getIndustry().then(res => {
        this.industry = this.changeDataTwo(res.result)
      })

    },
    changeDataTwo(obj) {
            let arr = [];
            for (let item of obj) {
                arr.push({
                    name: item.display_name + '',
                    value: item.id + '',
                    parent: 0,
                });
                if (item.selected_children) {
                    for (let children of item.selected_children) {
                        arr.push({
                            name: children.display_name + '',
                            value: children.id + '',
                            parent: item.id + '',
                        });
                    }
                }
            }
            return arr;
    },
    choseLevel(){
      let {consumption_level,age_level} = this.companyInfo
      this.consumptionLevel.map(item=>{
        for(let value of consumption_level){
          if(value.id == item.id){
            item.flag=true ;
            break;
          }
        }
        return item
      })
       this.agelevel.map(item=>{
        for(let value of age_level){
          if(value.id == item.id){
            item.flag=true ;
            break;
          }
        }
        return item
      })
    },
    chooseIndustry(e){

      let industry_id =  e[1]?e[1] * 1:e[0] * 1;
      this.companyInfo.industry_id =industry_id
      for (let item of this.industry) {
          if(industry_id==item.id){
            this.companyInfo.industry_name = item.name;
            break;
          }
      }
      this.isFoodInduatry()
    },
    selectedItem(item){

      item.flag=!item.flag;
    },
    setCityList(item) {

            item.flag = !item.flag
        },
    changeData(obj) {
      let arr = [];
      for (let item of obj) {
        arr.push({
          name: item.display_name + '',
          value: item.id + ''
        });
      }
      return arr;
    },
    isFoodInduatry(){
      if(!this.companyInfo.industry_id|| !this.catering_industry_id.length){
        return;
      }
      this.is_food_induatry = this.catering_industry_id.find((value, index, arr) => {
        return this.companyInfo.industry_id == value;
      })
    },
    changeSelectData(obj) {
      for (let item of obj) {
        Object.assign(item, { "flag": false });
      }
      return obj;
    },
    changeSpreadWay(e){
      for(let item of this.spreadway){
        if(item.value==e[0]){
          this.companyInfo.spread_way ={
            id:+item.value,
            spread_way:item.name}
          break;
        }
      }
    },
    changePushingFrequencyLevel(e){
      for(let item of this.pushfrequency){
        if(item.value==e[0]){
          this.companyInfo.pushing_frequency_level ={
            id:+item.value,
            display_name:item.name}
          break;
        }
      }
    },

    save(){
      let { consumptionLevel,agelevel ,cert_url:cert_urlArr} = this.$data;
      let {
        company='',
        product='',
        industry_id=undefined,
        spread_way=null,
        demand_area='',
        pushing_frequency_level,
        acceptable_minimum_price,
        acceptable_maximum_price,
        food_safety_license,
        images,
        cert_url,
        feature_description=''
      } = this.companyInfo

      let consumption_level_id = []
      for (let item of consumptionLevel) {
        if (item.flag) {
          consumption_level_id.push(item.id)
        }
      }
      let age_level_id = []
      for (let item of agelevel) {
        if (item.flag) {
          age_level_id.push(item.id)
        }
      }
      if(!this.checkParams()){
        return
      }

      let params = {
        company,
        product,
        industry_id,
        cert_url:cert_urlArr[0]||cert_url,
        consumption_level_id: JSON.stringify(consumption_level_id),
        age_level_id: JSON.stringify(age_level_id),
        food_safety_license: JSON.stringify(food_safety_license),
        images: JSON.stringify(images),
        feature_description
      }
      params.spread_way_id=spread_way.id
       if (demand_area != '' || demand_area === '0.00' || demand_area === 0 || demand_area) {
          params.demand_area = Number(demand_area).toFixed(2)
        }
      if (pushing_frequency_level !== null && pushing_frequency_level.id) {
          params.pushing_frequency_level_id = pushing_frequency_level.id
        }
      if (acceptable_minimum_price === 0 || acceptable_minimum_price === '0.00' || acceptable_minimum_price) {
          params.acceptable_minimum_price = Number(acceptable_minimum_price).toFixed(2)
        }
      if (acceptable_maximum_price === 0 || acceptable_maximum_price === '0.00' || acceptable_maximum_price) {
        if (acceptable_minimum_price) {
          if (acceptable_maximum_price < acceptable_minimum_price) {
            this.$vux.toast.text('最低价大于最高价！', 'middle');
            this.companyInfo.acceptable_maximum_price = ''
            return;
          }
        }
        params.acceptable_maximum_price = Number(acceptable_maximum_price).toFixed(2)
      }

      postCompanyInfo(params).then(res=>{
        this.$router.go(-1)
      })
    },
    checkParams(){
      let {
        company='',product='',industry_id=undefined,spread_way=null,
      } = this.companyInfo
      if(!company){
        this.$vux.toast.text('请填写公司名称', 'middle');
        return false;
      }
      if(!industry_id){
        this.$vux.toast.text('请填写公司名称', 'middle');
        return false;
      }
      if(!company){
        this.$vux.toast.text('请填写公司名称', 'middle');
        return false;
      }
      if(spread_way==null||!spread_way.id){
        this.$vux.toast.text('请选择推广方式', 'middle');
        return false;
      }
      return true;
    }
  }

}

</script>
<style lang="scss">
@import "../../style/mixin";

body,
html {
  background: $bgc;

}

.company {
  padding-bottom:.2rem;
  .C-item {
    .weui-cell__hd {
      @include sc(0.28rem, #333);
      @include wh(1.5rem, auto);
    }
    .weui-cell_access {
      display: flex;
    }
    .vux-popup-picker-select-box {
      @include wh( 4.5rem, auto);
      @include sc(0.26rem, #888);
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../style/mixin";

@mixin angle($width, $bw, $color, $direction) {
  position: relative;
  &::after {
    content: " ";
    display: inline-block;
    height: $width;
    width: $width;
    border: $bw solid $color;
    border-color: $color $color transparent transparent; // -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    // transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: rotate($direction) translateY(-50%);
    position: absolute;
    top: 50%;
    right: 0;
  }
}



/*
 reset weui css start...
 */

.weui-cells {
  line-height: 0.9rem;
}

.vux-cell-box {
  width: 100%!important;
}

.vux-cell-box:before {
  height: 0 !important;
  border-top: 0 none !important;
}

.weui-cells:before,
.weui-cells:after {
  content: "";
  height: 0 !important;
  border-top: 0 none !important;
  border-bottom: 0 none !important;
}

.weui-cell {
  line-height: 0.9rem;
  font-size: 0.28rem;
  padding: 0!important;
}

.weui-cell_access .weui-cell__ft:after {
  width: 0.1rem;
  height: 0.1rem;
}

.weui-cell:before {
  height: 0;
  border-top: 0 none!important;
}

.vux-cell-box:before {
  position: relative;
}

.vux-no-group-title {
  margin-top: 0 !important;
}

.user .weui-cell__hd,
.description .weui-cell__hd {
  width: 0 !important;
}



/* reset weui css end */

.company {
  .C-main {
    .save {
      width: 7rem;
      height: 0.88rem;
      line-height: 0.88rem;
      margin: 0.8rem auto;
      border-radius: 0.06rem;
      text-align: center;
      @include sc(0.32rem, #fff);
      background-color: $mainColor;
    }
    .C-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      background: #fff;
      .C-item {
        margin: 0 0.28rem;
        padding-right: 0.28rem;
        min-height: 0.9rem;
        display: flex;
        align-items: center;
        @include angle(0.15rem, 0.02rem, #888, 45deg);
        @include bt-1px(#ddd);
        position: relative;
        &:first-child {
          @include bt-1px(transparent);
        }
        &.no-angle {
          &::after {
            display: none;
          }
        }
        &.item-two {
          line-height: 0.64rem;
          flex-direction: column;
          align-items: flex-start;
          .tit {
            @include wh(auto, .64rem);

          }
          .tags {
            display: flex;
            flex-wrap: wrap;
            @include wh(100%, auto);

              .tag {
                @include wh(2rem, .64rem);
                text-align: center;
                border-radius: 0.06rem;
                box-sizing: border-box;
                border: 1px solid #ddd;
                @include sc(0.26rem, #666);
                margin-right: 0.2rem;
                margin-bottom: 0.2rem;
                &.active {
                  color: $mainColor;
                  background: #ddf0ff;
                  border-color: $mainColor;
                }
              }

            &.price-area {

              .price-input {
                @include wh(1rem, auto);
                text-align: center;
              }
            }
          }
          .textarea {
            @include wh(100%, 1.04rem);
            @include sc(0.26rem, #666);
            background: #fafafa;
            text-indent: 0.2rem;
            margin-bottom:0.2rem;
            resize: none;
          }
          .field-image {
            padding-bottom: 0.2rem;
            .vux-x-icon {
              fill: #999;
              margin-right: 0.1rem;
            }
            .ic-camera {
              @include wh( 1.5rem, 1.5rem);
              border: 1px solid #ccc;
              @include bg-image('../../images/ic_photograph_two_five');
              background-size: 0.55rem 0.44rem !important;
              background-position: center;
            }
            img {
              @include wh( 1.5rem, 1.5rem);
              margin-right: 0.1rem;
              margin-bottom: 0.1rem;
            }
          }
        }
        .profile-avatar {
          @include wh(0.7rem, 0.7rem);
          border-radius: 50%;
          @include bg-image( '../../images/ic_mine_default_three')
        }
        .require-icon{
          top:0.35rem;
          left:1.16rem;
            position: absolute;
            color: $red;
          }
        .tit {
          @include sc(0.28rem, #333);
          @include wh(1.5rem, auto);

        }
        .input {
          @include wh( 4.5rem, auto);
          @include sc(0.26rem, #888);
        }
        .deman-input {
          width: 2.4rem;
          margin-right: 0.2rem;
        }
      }
    }
  }
}
</style>

