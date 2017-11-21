<template lang="html">
  <div>
    <v-head isFixed="true" goBack="true">
      <div slot="center-part">特色主题展</div>
    </v-head>
    <section class="thematic-list" v-if="articles.length">
      <div v-for="(item,index) in articles" :key="index">
        <a href="item.origin" class="item-link" v-if="item.origin">
          <img v-lazy="item.pic_url" alt="a">
          <div class="tit ellipsis">{{ item.digest }}</div>
        </a>
        <router-link class="item-link" to="{ name : 'thematicDetail' , params : { id : item.id } }" v-else>
          <img v-lazy="item.pic_url" alt="a">
          <div class="tit ellipsis">{{ item.digest }}</div>
        </router-link>
      </div>

    </section>
    <section class="no-data" v-else>暂无数据</section>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead.vue';
  import { getThemenShow } from 'src/service/getData';
export default {
  data () {
    return {
      page : 1 ,
      pageSize : 10 ,
      articles : [] ,
    }
  },
  components: {
    vHead
  },
  mounted(){
    let p = {
      page : this.page ,
      pageSize : this.pageSize ,
      position : 'theme'
    };
    getThemenShow( p ).then(res => {
      this.articles = res.result ;
    })
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .thematic-list{
    padding: 0.24rem 0.24rem 0;
    background-color: #fff;
    .item-link{
      display: block;
      img{
        @include wh(100%,3.9rem);
      }
      .tit{
        line-height: 0.7rem;
        border-bottom: 1px solid #e8e8e8;
        margin-bottom: 0.2rem;
        font-size: 0.3rem;
        color: $fontColor;
      }
      &:last-child{
        .tit{
          border-bottom: 0 none;
        }
      }
    }
  }
  .no-data{
    margin: 0.4rem  0;
    text-align: center;
    @include sc(0.28rem,#999);
  }
</style>
