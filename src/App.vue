<template>
  <div>
    <transition name="router-slid" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" :key="key"></router-view>
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive" :key="key"></router-view>
    </transition>
  </div>
</template>

<script type='text/javascript'>
  try{
    (function(m, ei, q, i, a, j, s) {
      m[i] = m[i] || function() {
          (m[i].a = m[i].a || []).push(arguments)
        };
      j = ei.createElement(q),
        s = ei.getElementsByTagName(q)[0];
      j.async = true;
      j.charset = 'UTF-8';
      j.src = '//static.meiqia.com/dist/meiqia.js';
      s.parentNode.insertBefore(j, s);
    })(window, document, 'script', '_MEIQIA');
    _MEIQIA('entId', 53899);
    _MEIQIA('withoutBtn');
  } catch (err){}

  // 解决动态路由切换路由不跳转的问题
  export default {
    computed : {
      key() {
        return this.$route.name !== undefined? '/#/'+ this.$route.name + +new Date(): '/#/'+ this.$route + +new Date()
      }
    }
  }
</script>
<style lang="scss">
  	@import './style/common';
   /*透明度切换模式*/
    .router-fade-enter-active, .router-fade-leave-active {
      transition: opacity .3s;
    }
    .router-fade-enter, .router-fade-leave-active {
      opacity: 0;
    }
    /*滑动切换模式*/
    .router-slid-enter-active, .router-slid-leave-active {
      transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
      transform: translateX( -100% );
      opacity: 0.5;
    }
</style>
