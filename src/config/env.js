/**
* 配置运行环境与线上环境的切换
* baseUrl 为域名地址
* imgBaseUrl 为图片所在域名地址
* routerMode 为路由模式
*/

let baseUrl = '' ;
let imgBaseUrl = '' ;
let routerMode = 'hash' ;


if (process.env.NODE_ENV == 'development') {
  baseUrl = 'http://api.lanhanba.net' ;
  imgBaseUrl = 'http://m.lanhanba.net' ;

}
else if(process.env.NODE_ENV == 'production'){
  baseUrl = 'http://api.lanhanba.net' ;
  imgBaseUrl = 'http://m.linhuiba.com' ;
}

export {
  baseUrl,
  imgBaseUrl,
  routerMode
}
