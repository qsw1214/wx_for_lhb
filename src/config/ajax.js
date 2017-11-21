import Vue from 'vue'
import { AjaxPlugin } from 'vux' // 依赖axios，本质上是相同的,可参考axios文档
import { baseUrl } from 'src/config/env';
Vue.use( AjaxPlugin ) ;

export default (obj) => {
  Vue.http.defaults.baseURL = baseUrl ;
  Vue.http.defaults.headers.post['Content-Type'] = 'appliction/x-www-form-urlencoded';
  return new Promise( (resolve , reject ) => {

    Vue.http(obj).then( res => {
      if( res.data.code === 1 ){
        resolve( res.data ) ;
      } else if (res.data.code === -99) {
        reject( res.data ) ;
      } else {
        reject( res.data ) ;
      }
    }).catch( err => {
      reject( err );
    })
  })
}
