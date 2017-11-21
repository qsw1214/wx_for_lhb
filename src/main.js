
import Vue from 'vue'  // Vue.js v2.3.4
import VueRouter from 'vue-router' // vue-router v2.6.0
import { routerMode } from './config/env'
import routes from './router/router'
import './config/rem'
import store from './store' // vuex v2.3.0
import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload' // Vue-Lazyload v1.0.5
import 'babel-polyfill'
import { AlertPlugin , ToastPlugin, LoadingPlugin, ConfirmPlugin, WechatPlugin } from 'vux' // toast , loading 以插件模式全局调用
import BaiduMap from 'vue-baidu-map'
import { getSession , setSession } from './config/tools'

// click事件换成touchstart
if('addEventListener' in document){
  document.addEventListener('DOMContentLoaded' , function(){
    FastClick.attach(document.body);
  } , false);
}
Vue.config.productionTip = false ;// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.use( VueRouter ) ;
Vue.use(AlertPlugin);
Vue.use( ToastPlugin ) ;
Vue.use( LoadingPlugin );
Vue.use( ConfirmPlugin );
Vue.use(WechatPlugin);
Vue.use( BaiduMap , {
   ak : 'yc3n5fiQQVezzrpESqpE6BCM'
}) ;
Vue.use( VueLazyload , {
  proLoad : 1.3, // 预加载比例(超前加载)
  error: 'https://comment.linhuiba.com/Fia3BCjHyan2ZrniNODOaIV4XtZ3', // 图片加载失败时站位的图
  loading: '' ,// 正在加载时的动画图
  attempt: 1 , // 尝试加载次数
  listenEvents : ['scroll','touchmove'] // 触发事件
});

const router = new VueRouter({
  routes,
  mode : routerMode,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        // 保存前一个 缓存路由 的scrolltop;
        from.meta.savedPosition = document.body.scrollTop;
      }
      // 返回的时候回到刚保存的scrolltop;
      return { x: 0, y: to.meta.savedPosition ||0}
    }
  }

}) ;

router.beforeEach((to , from , next) => {
  // 处理app加载传入的权限信息
  if( to.query.key ){
    setSession('key' ,  to.query.key );
  }else{  next() }

  if( to.matched.some( record => record.meta.requiresAuth ) ){
    let login = getSession( 'login' ) ;
    if( !login ){
      next({
        path : '/login',
        query : { redirect : to.fullPath }
      })
    }else{ next() }
  }else{ next() }


});
router.afterEach((to , from , next) => {
  if( window.ga ) {
    window.ga('set', 'page', to.fullPath); // 你可能想根据请求参数添加其他参数，可以修改这里的 to.fullPath
    window.ga('send', 'pageview');
  }
});
new Vue({
  router,
  store
}).$mount('#app');
