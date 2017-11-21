<template lang="html">
  <div class="help">
      <v-head path="/admin/profile" isFixed="true">
        <div slot="center-part">帮助中心</div>
      </v-head>
      <section>
        <div class="help-list" v-for="( item , index ) in helpList" :key="item.id">
            <div v-show="helpList[index].type!=(index==0?'': helpList[(index - 1)].type)" class="help-item help-type">{{item.type}}</div>
            <router-link :to="{ name: 'article' , params : { id : item.id } ,query:{page:'help'}}"><div  class="help-item help-tit">{{item.name}}</div></router-link>
        </div>
      </section>
  </div>
</template>

<script>
import vHead from 'src/components/vHead'
import { getHelp } from 'src/service/getData';
import { getStorage } from 'src/config/tools';
export default {
  data() {
    return {
      helpList: [], // 文章列表
    }
  },
  components: { vHead},
  created() {
    this.$vux.loading.show({ text: 'loading...' });

  },
  async mounted() {
    let res = await getHelp()
    this.helpList = res.result;
    this.$vux.loading.hide();
  },
  methods: {
  }

}

</script>

<style lang="scss" scoped>
@import "../../style/mixin";

.help {
  background: $bgc;
  .help-list {

    .help-item {
      height: 0.9rem;
      background: #fff;
      border-bottom: 1px solid #e8e8e8;
      padding: 0 0.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &.help-type {
        margin-top: 0.2rem;
        font-weight: 900;
        background: #fafafa;
      }
      &.help-tit {

      }
    }
    &:nth-child(1) {
      .help-item:first-child {
        margin-top: 0;
      }
    }

    &:last-child{
      // margin-bottom: 0.2rem
    }
  }
}
</style>
