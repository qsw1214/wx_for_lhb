<template lang="html">

    <div class="filter-wraper" ref="viewbox">
    <div class="drop">
      <div class="title" :class="{ active : !typehide }" @click="changState(1)">
         <div class="title-left">所属区域</div>
         <div class="view-more">
           <span>更多</span><span class="cert"></span>
         </div>
      </div>
      <div class="type-box">
          <div class="type-item"
          v-for="( item , index ) in districts"
          :class="{ hide : (index > 3 ? typehide : false) , active : item.is_select }"
          @click.stop="districtSelect( item )"
           :key="index"
           >
              <span>{{ item.name }}</span>
          </div>
      </div>
    </div>
    <div class="drop">
      <div class="title" :class="{ active : !fieldhide }" @click="changState(2)">
         <div class="title-left">活动类型</div>
         <div class="view-more">
           <span>更多</span><span class="cert"></span>
         </div>
      </div>
      <div class="type-box">
          <div class="type-item"
          v-for="( item , index ) in fieldtypes"
          :class="{ hide : (index > 3 ? fieldhide : false) , active : item.is_select }"
          @click.stop="districtSelect( item )"
           :key="index"
           >
              <span>{{ item.type }}</span>
          </div>
      </div>
    </div>
    <div class="drop">
      <div class="title" :class="{ active : !service }" @click="changState(3)">
         <div class="title-left">服务项目</div>
         <div class="view-more">
           <span>更多</span><span class="cert"></span>
         </div>
      </div>
      <div class="type-box">
          <div class="type-item"
          v-for="( item , index ) in facility_tags"
          :class="{ hide : (index > 3 ? service : false) , active : item.is_select }"
          @click.stop="districtSelect( item )"
           :key="index"
           >
              <span>{{ item.dispaly_name }}</span>
          </div>
      </div>
    </div>
     <div class="drop">
      <div class="title" :class="{ active : !trading }" @click="changState(4)">
         <div class="title-left">所属商圈</div>
         <div class="view-more">
           <span>更多</span><span class="cert"></span>
         </div>
      </div>
      <div class="type-box">
          <div class="type-item"
          v-for="( item , index ) in trading_area"
          :class="{ 'hide' : (index > 3 ? trading : false ) , active : item.is_select }"
          @click.stop="districtSelect( item )"
           :key="index"
           >
              <span>{{ item.name }}</span>
          </div>
      </div>
    </div>
     <div class="drop">
      <div class="title">
         <div class="title-left">场地位置</div>
      </div>
      <div class="type-box">
          <div class="type-item"
          v-for="( item , index ) in indoor"
          :class="{ active : item.is_select }"
          @click.stop="districtSelect( item )"
           :key="index"
           >
              <span>{{ item.name }}</span>
          </div>
      </div>
    </div>
     <div class="drop">
      <div class="title" :class="{ active : !linhui }" @click="changState(5)">
         <div class="title-left">邻汇推荐</div>
         <div class="view-more">
           <span>更多</span><span class="cert"></span>
         </div>
      </div>
      <div class="type-box">
          <div class="type-item"
          v-for="( item , index ) in field_labels"
          :class="{ hide : (index > 3 ? linhui : false) , active : item.is_select }"
          @click.stop="districtSelect( item )"
           :key="index">
              <span>{{ item.display_name }}</span>
          </div>
      </div>
    </div>
    <div class="drop">
      <div class="title">
         <div class="title-left">价格区间(元)</div>
      </div>
      <div class="type-box">
          <input type="number" placeholder="最低价" v-model="lowPrice" autocomplete="off"><span class="center-line"></span><input type="number" autocomplete="off" placeholder="最高价" v-model="highPrice">
      </div>
    </div>
    <div class="drop">
      <div class="title">
         <div class="title-left">人流量</div>
      </div>
      <div class="type-box">
          <input type="number" autocomplete="off" placeholder="最小值" v-model="minimum_peoples"><span class="center-line"></span><input type="number" autocomplete="off" placeholder="最大值" v-model="maximum_peoples">
      </div>
    </div>
    <div class="drop">
      <div class="title">
         <div class="title-left">建筑年份</div>
      </div>
      <div class="type-box">
          <input type="number" autocomplete="off" placeholder="起始年份" v-model="minimum_build_year"><span class="center-line"></span><input type="number" autocomplete="off" placeholder="终止年份" v-model="maximum_build_year">
      </div>
    </div>
    <div class="drop">
      <div class="title">
         <div class="title-left">户数</div>
      </div>
      <div class="type-box">
          <input type="number" placeholder="最小户数" autocomplete="off" v-model="minimum_households"><span class="center-line"></span><input type="number" placeholder="最大户数" autocomplete="off" v-model="maximum_households">
      </div>
    </div>
    <div class="drop">
      <div class="title">
         <div class="title-left">物业费</div>
      </div>
      <div class="type-box">
          <input type="number" placeholder="最低值" autocomplete="off" v-model="minimum_property_costs"><span class="center-line"></span><input type="number" placeholder="最高值" autocomplete="off" v-model="maximum_property_costs">
      </div>
    </div>
    <div class="drop">
      <div class="title">
         <div class="title-left">房价</div>
      </div>
      <div class="type-box">
         <input type="number" placeholder="最低房价" autocomplete="off" v-model="minimum_house_price"><span class="center-line"></span><input type="number" placeholder="最高房价" autocomplete="off" v-model="maximum_house_price">
      </div>
    </div>
    <div class="drop">
      <div class="title">
         <div class="title-left"><span>面积(m</span><sup>2</sup>)</div>
      </div>
      <div class="type-box">
         <input type="number" placeholder="最小面积" autocomplete="off" v-model="minimum_area">
      </div>
    </div>
    <div class="filter-bottom">
        <div class="reset" @click="reset">重置</div>
        <div class="submit" @click="submit">确定</div>
    </div>
    <div class="null"></div>
    </div>

</template>

<script>

  import { getConfig , getTrading , getLabels } from 'src/service/getData';
  import { FLOAT_REG , POSITIVE_INT_REG , INT_Four_REG } from 'src/config/data';
  import { getStorage } from 'src/config/tools';
  import { mapState , mapMutations } from 'vuex' ;
export default {
  data () {
    return {
      typeShow : false ,
      district_id : [],
      activity_type_id : [],
      trading_area_id : [],
      label_id : [],
      facilities : [],
      is_outdoor : [],
      childFilterData : {} , // 筛选条件
      typehide : false ,
      fieldhide : false ,
      service : false ,
      trading : false ,
      linhui : false ,
      districts : [] , // 区域列表
      fieldtypes : [] , // 活动类型列表
      facility_tags : [] , // 服务项目
      trading_area : [] , // 商圈
      field_labels : [] , // 邻汇推荐
      indoor : [{ id : 1 , name :'室内' , is_select : false } ,{ id : 0 ,name : '室外' , is_select : false  } ],
      cityId : null , // 城市id

      lowPrice : '' ,// 最低价
      highPrice : '' ,
      minimum_peoples : '' , // 人流量最小
      maximum_peoples : '' ,
      minimum_build_year : '' , // 建筑年份最小值
      maximum_build_year : '' ,
      minimum_households : '' , // 户数最小值
      maximum_households : '' ,
      minimum_property_costs : '', // 物业费的最小数
      maximum_property_costs : '' ,
      minimum_house_price : '' , // 房价的最小数
      maximum_house_price : '',
      minimum_area : '' , // 最小面积
    }
  },
  computed : {
    ...mapState(['filterData']),

  },
  created(){
    try{
      this.$vux.loading.hide();
    } catch( err ){}
    this.cityId = getStorage('cityId')|| this.$store.state.cityId || this.$route.query.city_id || 90;

  },
  methods:{
    ...mapMutations(['RECORD_FILTERDATA']),
    changState(m){
      if( m == 1 ){
        this.typehide = !this.typehide ;
      }else if( m == 2 ){
        this.fieldhide = !this.fieldhide ;
      }else if( m == 3 ){
        this.service = !this.service ;
      }else if( m == 4 ){
        this.trading = !this.trading ;
      }else if( m == 5 ){
        this.linhui = !this.linhui ;
      }
    },
    changeSelectData(obj){
      for (let item of obj) {
        Object.assign(item , {"is_select": false });
      }
      return obj;
    },
    districtSelect( item ){ // 选择
      item.is_select = !item.is_select ;
    },
    reset(){
      this.$router.go(0);
    },
    submit(){
      for( let item of this.districts ){
        if( item.is_select ){
          this.district_id.push( item.district_id )
        }
      }
      for( let item of this.fieldtypes ){
        if( item.is_select ){
          this.activity_type_id.push( item.code )
        }
      }
      for( let item of this.facility_tags ){
        if( item.is_select ){
          this.facilities.push( item.tag )
        }
      }
      for( let item of this.trading_area ){
        if( item.is_select ){
          this.trading_area_id.push( item.id )
        }
      }
      for( let item of this.indoor ){
        if( item.is_select ){
          this.is_outdoor.push( item.id )
        }
      }

      for( let item of this.field_labels ){
        if( item.is_select ){
          this.label_id.push( item.id )
        }
      }

      if( this.district_id.length ){
        // 数组去重
        this.district_id     = [...new Set( this.district_id )] ;
        this.childFilterData.district_id = this.district_id
      }
      if( this.activity_type_id.length ){
        this.activity_type_id   = [...new Set( this.activity_type_id )] ;
        this.childFilterData.activity_type_id = this.activity_type_id
      }
      if( this.facilities.length ){
        this.facilities      = [...new Set( this.facilities )] ;
        this.childFilterData.facilities = this.facilities
      }
      if( this.trading_area_id.length ){
        this.trading_area_id = [...new Set( this.trading_area_id )] ;
        this.childFilterData.trading_area_id = this.trading_area_id
      }
      if( this.is_outdoor.length ){
        this.is_outdoor      = [...new Set( this.is_outdoor )] ;
        this.childFilterData.is_outdoor = this.is_outdoor
      }
      if( this.label_id.length ){
        this.label_id        = [...new Set( this.label_id )] ;
        this.childFilterData.label_id = this.label_id
      }
      if( this.lowPrice ){
        if( !FLOAT_REG.test( this.lowPrice ) ){
          this.lowPrice = '';
          this.$vux.toast.text( '你输入的最低价只能为数字或者两位小数' ); return ;
        }else{
          this.childFilterData.lowPrice = this.lowPrice * 100;
        }
      }
      if( this.highPrice ){
        if( !FLOAT_REG.test( this.highPrice ) ){
          this.highPrice = '';
          this.$vux.toast.text( '你输入的最高价只能为数字或者两位小数' ); return ;
        }else{
          this.childFilterData.highPrice =this.highPrice * 100 ;
        }
      }
      if( this.lowPrice && this.highPrice && this.highPrice < this.lowPrice ){
        this.highPrice = '';
        this.$vux.toast.text( '你输入的最高价不能低于最低价' ); return ;
      }


      if( this.minimum_peoples ){
        if( !POSITIVE_INT_REG.test( this.minimum_peoples ) ){
          this.minimum_peoples = '' ;
          this.$vux.toast.text( '你输入的最小人流量只能为数字' ); return ;
        }else{
          this.childFilterData.minimum_peoples = +this.minimum_peoples ;
        }
      }
      if( this.maximum_peoples ){
        if( !POSITIVE_INT_REG.test( this.maximum_peoples ) ){
          this.maximum_peoples = '' ;
          this.$vux.toast.text( '你输入的最大人流量只能为数字' ); return ;
        }else{
          this.childFilterData.maximum_peoples = +this.maximum_peoples ;
        }
      }
      if( this.minimum_peoples && this.maximum_peoples && this.maximum_peoples < this.minimum_peoples ){
        this.maximum_peoples = '';
        this.$vux.toast.text( '你输入的最大人流量不能低于最小人流量' ); return ;
      }

      if( this.minimum_build_year ){
        if( !INT_Four_REG.test( this.minimum_build_year ) ){
          this.minimum_build_year = '' ;
          this.$vux.toast.text( '你输入的最小建筑年份只能为四位数数字' ); return ;
        }else{
          this.childFilterData.minimum_build_year = +this.minimum_build_year ;
        }
      }
      if( this.maximum_build_year ){
        if( !INT_Four_REG.test( this.maximum_build_year ) ){
          this.maximum_build_year = '' ;
          this.$vux.toast.text( '你输入的最大建筑年份只能为四位数数字' ); return ;
        }else{
          this.childFilterData.maximum_build_year = +this.maximum_build_year;
        }
      }
      if( this.minimum_build_year && this.maximum_build_year && this.maximum_build_year < this.minimum_build_year ){
        this.maximum_build_year = '';
        this.$vux.toast.text( '你输入的最大建筑年份不能低于最小建筑年份' ); return ;
      }


      if( this.minimum_households ){
        if( !POSITIVE_INT_REG.test( this.minimum_households ) ){
          this.minimum_households = '' ;
          this.$vux.toast.text( '你输入的最小户数只能为数字' ); return ;
        }else{
          this.childFilterData.minimum_households = +this.minimum_households ;
        }
      }
      if( this.maximum_households ){
        if( !POSITIVE_INT_REG.test( this.maximum_households ) ){
          this.maximum_households = '' ;
          this.$vux.toast.text( '你输入的最大户数只能为数字' ); return ;
        }else{
          this.childFilterData.maximum_households = +this.maximum_households ;
        }
      }
      if( this.minimum_households && this.maximum_households && this.maximum_households < this.minimum_households ){
        this.maximum_households = '';
        this.$vux.toast.text( '你输入的最大户数不能低于最小户数' ); return ;
      }


      if( this.minimum_property_costs ){
        if( !FLOAT_REG.test( this.minimum_property_costs ) ){
          this.minimum_property_costs = '' ;
          this.$vux.toast.text( '你输入的最小物业费只能为数字或者两位小数' ); return ;
        }else{
          this.childFilterData.minimum_property_costs = this.minimum_property_costs * 100 ;
        }
      }
      if( this.maximum_property_costs ){
        if( !FLOAT_REG.test( this.maximum_property_costs ) ){
          this.maximum_property_costs = '' ;
          this.$vux.toast.text( '你输入的最大物业费只能为数字或者两位小数' ); return ;
        }else{
          this.childFilterData.maximum_property_costs = +this.maximum_property_costs * 100 ;
        }
      }
      if( this.minimum_property_costs && this.maximum_property_costs && this.maximum_property_costs < this.minimum_property_costs ){
        this.maximum_property_costs = '';
        this.$vux.toast.text( '你输入的最大物业费不能低于最小物业费' ); return ;
      }

      if( this.minimum_house_price ){
        if( !FLOAT_REG.test( this.minimum_house_price ) ){
          this.minimum_house_price = '' ;
          this.$vux.toast.text( '你输入的最小房价只能为数字或者两位小数' ); return ;
        }else{
          this.childFilterData.minimum_house_price = this.minimum_house_price * 100 ;
        }
      }
      if( this.maximum_house_price ){
        if( !FLOAT_REG.test( this.maximum_house_price ) ){
          this.maximum_house_price = '' ;
          this.$vux.toast.text( '你输入的最大房价只能为数字或者两位小数' ); return ;
        }else{
          this.childFilterData.maximum_house_price = this.maximum_house_price * 100 ;
        }
      }
      if( this.minimum_house_price && this.maximum_house_price && this.maximum_house_price < this.minimum_house_price ){
        this.maximum_house_price = '';
        this.$vux.toast.text( '你输入的最大房价不能低于最小房价' ); return ;
      }


      if( this.minimum_area ){
        if( !FLOAT_REG.test( this.minimum_area ) ){
          this.minimum_area = '' ;
          this.$vux.toast.text( '你输入的最小面积只能为数字或者两位小数' ); return ;
        }else{
          this.childFilterData.minimum_area = +this.minimum_area ;
        }
      }

      if( JSON.stringify(this.childFilterData) == "{}" ){
        this.RECORD_FILTERDATA( {} );
        this.$emit( 'toFather' , {} );
      }else{
        this.RECORD_FILTERDATA( this.childFilterData );
        this.$emit( 'toFather' , this.childFilterData );
      }
      this.$router.push('/activities');
    },

    showSelected(){
      if( JSON.stringify(this.filterData) != "{}" ){
        if( this.filterData.district_id&&this.filterData.district_id.length ){
          for( let item of this.filterData.district_id ){
            for( let i of this.districts ){
              if( i.district_id == item ){
                i.is_select = true ;
              }
            }
          }
        }
        if( this.filterData.activity_type_id&&this.filterData.activity_type_id.length ){
          for( let item of this.filterData.activity_type_id ){
            for( let i of this.fieldtypes ){
              if( i.code == item ){
                i.is_select = true ;
              }
            }
          }
        }
        if( this.filterData.facilities&&this.filterData.facilities.length ){
          for( let item of this.filterData.facilities ){
            for( let i of this.facility_tags ){
              if( i.tag == item ){
                i.is_select = true ;
              }
            }
          }
        }
        if( this.filterData.trading_area_id&&this.filterData.trading_area_id.length ){
          for( let item of this.filterData.trading_area_id ){
            for( let i of this.trading_area ){
              if( i.id == item ){
                i.is_select = true ;
              }
            }
          }
        }
        if( this.filterData.is_outdoor&&this.filterData.is_outdoor.length ){
          for( let item of this.filterData.is_outdoor ){
            for( let i of this.indoor ){
              if( i.id == item ){
                i.is_select = true ;
              }
            }
          }
        }
        if( this.filterData.label_id&&this.filterData.label_id.length ){
          for( let item of this.filterData.label_id ){
            for( let i of this.field_labels ){
              if( i.lid == item ){
                i.is_select = true ;
              }
            }
          }
        }
        this.lowPrice = this.filterData.lowPrice ? this.filterData.lowPrice / 100 : undefined;
        this.highPrice = this.filterData.highPrice ? this.filterData.highPrice / 100 : undefined;
        this.minimum_peoples = this.filterData.minimum_peoples ;
        this.maximum_peoples = this.filterData.maximum_peoples ;
        this.minimum_build_year = this.filterData.minimum_build_year ;
        this.maximum_build_year = this.filterData.maximum_build_year ;
        this.minimum_households = this.filterData.minimum_households ;
        this.maximum_households = this.filterData.maximum_households ;
        this.minimum_property_costs = this.filterData.minimum_property_costs ? this.filterData.minimum_property_costs / 100 : undefined;
        this.maximum_property_costs = this.filterData.maximum_property_costs ? this.filterData.maximum_property_costs / 100 : undefined ;
        this.minimum_house_price = this.filterData.minimum_house_price ? this.filterData.minimum_house_price / 100 : undefined ;
        this.maximum_house_price = this.filterData.maximum_house_price  ? this.filterData.maximum_house_price / 100 : undefined ;
        this.minimum_area = this.filterData.minimum_area;
      }

    }
  },
  mounted(){
    let city_id = this.cityId ;
    let config = this.$store.state.config || getStorage( 'config' );


    for( let item of config.citylist ){
     if( item.city_id === city_id ){
       this.districts    = this.changeSelectData( item.districts ) ;
       this.trading_area = this.changeSelectData( item.trading_areas ) ;
       this.field_labels = this.changeSelectData( item.labels ) ;
      }
    }
    this.fieldtypes    = this.changeSelectData( config.activity_types ) ;
    this.facility_tags = this.changeSelectData( config.facility_tags ) ;

      // 处理选中高亮效果
    this.showSelected();

  }
}

</script>

<style lang="scss" scoped>
  @import "../../../style/mixin";
  .filter-wraper{
    position: absolute;
    top: 0 ;
    left: 0 ;
    bottom: 0;
    right: 0;
    overflow: auto;
    z-index: 100;
    background-color: $white;
    .drop{
      background-color: #fff;
      .title{
        display: flex;
        padding: 0.24rem 0.24rem 0.1rem;
        justify-content: space-between;
        .title-left{
          font-size: 0.28rem;
          color: #666;
        }
        .view-more{
          font-size: 0.24rem;
          color: #999;
          .cert{
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.08rem;
            @include wh( 0.2rem , 0.1rem );
            @include bg-image('../../../images/ic_open_gary_button_normal_three');
          }
        }
        &.active{
          .cert{
            @include bg-image('../../../images/ic_open_gary_one_button_normal_three');
          }
        }
      }
      .type-box{
        display: inline-flex;
        justify-content: start;
        width: 100%;
        flex-wrap: wrap;
        padding: 0 0.24rem 0.36rem;
        .type-item{
          flex : 0 0 1.6rem;
          height: 0.64rem;
          border: 1px solid #ccc;
          border-radius: 0.04rem;
          margin: 0.2rem 0.2rem 0 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          &.active{
            color: $mainColor;
            border: 1px solid $mainColor;
            background-color: rgba(0,133,227 , 0.15);
          }
          &:nth-child(4n){
            margin-right:0;
          }
          >span{
            text-align: center;
            font-size: 0.26rem;
          }
        }
        >input[type="number"]{
          @include wh( 1.6rem , 0.64rem );
          margin-top: 0.2rem;
          border: 1px solid #ccc;
          border-radius: 0.04rem;
          text-align: center;
          font-size: 0.26rem;
          color: $mainColor;
          &:focus{
            color: $mainColor;
            border: 1px solid $mainColor;
          }
        }
        > .center-line{
          display: inline-block;
          vertical-align: top;
          @include wh( 0.24rem , 0.01rem );
          margin: 0.5rem 0.16rem 0;
          background-color: #ccc;
        }
      }
    }
    .filter-bottom{
      position: fixed;
      bottom: 0;
      left: 0;
      @include wh( 100% , 0.96rem );
      display: flex;
      justify-content: space-between;
      text-align: center;
      line-height: 0.96rem ;
      font-size: 0.32rem;
      color: #fff;
      .reset{
        flex: 0 0 50%;
        background-color: #109ee7;
      }
      .submit{
        flex: 0 0 50%;
        background-color: $mainColor;
      }
    }
    .null{
      height: 1rem;
    }
  }
</style>
