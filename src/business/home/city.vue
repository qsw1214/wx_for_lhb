<template lang="html">

    <div class="city-wraper">
      <v-head go-back="true" isFixed="true">
        <div slot="center-part">选择城市</div>
      </v-head>
      <div class="current-city">当前城市:<span class="city">{{ cityName }}</span></div>
      <div class="city-list">
        <p class="agree-city">已开通城市</p>
        <Flexbox :gutter="0" wrap="wrap">
          <FlexboxItem :span="1/4" v-for="item in cityArr" :key="item.id">
            <span class="item" @click="selectCity( item.id , item.name )">{{ item.name }}</span>
          </FlexboxItem>
        </Flexbox>
      </div>
    </div>

</template>

<script>
  import { getCitys } from 'src/service/getData';
  import { mapState , mapMutations } from 'vuex' ;
  import { getStorage } from 'src/config/tools' ;
  import vHead from 'src/components/vHead' ;
  import { Flexbox , FlexboxItem } from 'vux' ;
export default {
  data () {
    return {
      cityArr : [] ,
      cityName : '定位失败'
    }
  },
  computed : {
    ...mapState([
      'citys'
    ])
  },
  created () {
    this.cityName = getStorage( 'cityName');
  },
  beforeRouteLeave(to , from , next){
    to.meta.keepAlive = false ;
    next()
  },
  components : {
    vHead,
    Flexbox,
    FlexboxItem
  },
  mounted (){
    if( !this.citys ){
      getCitys().then( res => {
        this.cityArr = res.result;
        this.ALL_CITYS( res.result );
      }).catch( err => {
        this.$vux.toast.text('获取已开通城市列表失败','middle');
      })
    }else{
      this.cityArr = this.citys ;
    }
  },
  methods : {
    ...mapMutations([
        'ALL_CITYS'
    ]) ,
    selectCity( id , name ) {
      this.$store.commit( 'RECORD_CITY' , id );
      this.$store.commit( 'RECORD_CITYNAME' , name );
      this.$router.push('/home');
    }
  }
}

</script>
<style lang="scss">
    @import "../../style/mixin";
    html, body {
        background-color: $bgc;
    }
</style>
<style lang="scss" scoped>
  @import "../../style/mixin";

  .current-city {
    margin-top: 0.2rem;
    padding: 0 0.28rem;
    height: 0.9rem;
    line-height: 0.9rem;
    font-size: 0.28rem;
    color: #888;
    background-color: $white;
    .city {
      margin-left: 0.3rem;
      font-size: 0.34rem;
      color: #333;
    }
  }
  .city-list {
    padding: 0 0.28rem;
    .agree-city {
      margin-top: 0.3rem;
      font-size: 0.28rem;
      color: #888;
    }

    .item {
      display: block;
      width: 1.5rem;
      height: 0.6rem;
      margin-top: 0.2rem;
      line-height: 0.6rem;
      text-align: center;
      border-radius: 0.06rem;
      font-size: 0.28rem;
      color: #333;
      background-color: $white;
    }
  }
</style>
