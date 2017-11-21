<template lang="html">
  <div class="industry-wrap">
      <v-head go-back="true">
        <div slot="center-part">行业选择</div>
      </v-head>
      <section class="I-content">
        <ul class="select-parent">
          <li @click.stop="setParentId(item)" :class="selected_parent_id==item.id?'active':''" v-for="(item,index) in industry">{{item.display_name}}</li>

        </ul>
        <ul class="select-children">
          <li @click.stop="chooseIndustry(item)" v-for="(item,index) in industryChlidren">{{item.display_name}}</li>
        </ul>
      </section>

  </div>
</template>

<script>
import vHead from 'src/components/vHead'
import { getIndustry } from 'src/service/getData';
export default {
  data() {
    return {
      industry:[],
      industryChlidren:[],
      selected_parent_id:''
    }
  },
  components: { vHead },

  computed:{
  },
  created() {
    this.initData()
  },
  mounted() {

  },
  methods: {
    initData(){
      getIndustry().then(res => {

        this.industry = res.result;
        this.industryChlidren = res.result[0].selected_children;
        this.selected_parent_id = res.result[0].id
      })
    },
    setParentId(item){
      this.selected_parent_id = item.id;
      this.industryChlidren = item.selected_children;
    },
    chooseIndustry(item){
    this.$emit('industry',item);
      this.$router.go(-1)
    }
  }

}

</script>
<style lang="scss" scoped>
@import "../../../style/mixin";
.industry-wrap {
  @include allcover;
  z-index: 100;
  background-color: $bgc;
  @include wh(100%, 100%);
  overflow: hidden;
  position: fixed;
}
.industry-wrap{
  .I-content{
    display: flex;

 height:100%;

    ul{
      flex:1;
      height:100%;
      overflow: auto;
      background: #e8e8e8;
      &.select-parent{
        background: #fff;
        display: flex;
        flex-direction: column;
        li{
          margin:0 0.15rem 0 0.3rem;
          line-height: 0.9rem;
          @include wh( auto,0.9rem);
          @include bt-1px(#ddd);
           @include sc(0.28rem, #333);
          &::last-child{
            @include bt-1px(transparent);
          }
        }
      }
      &.select-children{
        display: flex;
        flex-direction: column;
        li{
          margin:0 0.3rem 0 0.15rem;
          line-height: 0.9rem;
          @include wh( auto,0.9rem);
          @include bt-1px(#ccc);
           @include sc(0.26rem, #333);
          &::last-child{
            @include bt-1px(transparent);
          }
        }
      }
      li{
          line-height: 0.9rem;
          @include wh( auto,0.9rem);
          @include bt-1px(#ddd);
          &.active{
            background: #e8e8e8;
            margin:0;
            text-indent: 0.3rem;
            color:$mainColor;
             @include bt-1px(transparent);
          }
        }
    }
  }
}


</style>

<style lang="scss">
@import "../../../style/mixin";
body,
html {
 @include wh(100%, 100%);
}

</style>
