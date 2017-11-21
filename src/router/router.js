 import APP from '../App'

// 组件封装路由
const com              = r => require.ensure( [] , () => r(require('../components/appScrollhead.vue')) , 'com' )

// 商家端路由

 /*
 *  gourd start
 */
const home             = r => require.ensure( [] , () => r(require('../business/home/home')) , 'home' );
const city             = r => require.ensure( [] , () => r(require('../business/home/city')) , 'city' );
const search           = r => require.ensure( [] , () => r(require('../business/search/search')) , 'search' );
const fields           = r => require.ensure( [] , () => r(require('../business/fields/fields')) , 'fields' );
const fieldtypeList    = r => require.ensure( [] , () => r(require('../business/fields/fieldtypeList')) , 'fieldtypeList' );
const filter           = r => require.ensure( [] , () => r(require('../business/fields/children/filter')) , 'filter' );
const fieldsDetail     = r => require.ensure( [] , () => r(require('../business/fields/fieldsDetail')) , 'fieldsDetail');
const fieldInfo        = r => require.ensure( [] , () => r(require('../business/fields/children/fieldInfo')) , 'fieldInfo');
const activities       = r => require.ensure( [] , () => r(require('../business/activities/activities')) , 'activities');
const acfilter         = r => require.ensure( [] , () => r(require('../business/activities/children/acfilter')) , 'acfilter');
const actInfo          = r => require.ensure( [] , () => r(require('../business/activities/children/acInfo')) , 'actInfo');
const activitiesDetail = r => require.ensure( [] , () => r(require('../business/activities/activitiesDetail')) , 'activitiesDetail');
const ads              = r => require.ensure( [] , () => r(require('../business/ads/ads')) , 'ads');
const adsDetail        = r => require.ensure( [] , () => r(require('../business/ads/adsDetail')) , 'adsDetail');
const themes           = r => require.ensure( [] , () => r(require('../business/themes/themes')) , 'themes');
const themesDetail     = r => require.ensure( [] , () => r(require('../business/themes/themesDetail')) , 'themesDetail');
const mLogin           = r => require.ensure( [] , () => r(require('../business/login/children/mobile')) , 'mLogin' );
const login            = r => require.ensure( [] , () => r(require('../business/login/base')) , 'login' );
const register         = r => require.ensure( [] , () => r(require('../business/login/register')) , 'register');
const findPassword     = r => require.ensure( [] , () => r(require('../business/login/children/findpassword')) , 'findPassword');
const bindMobile       = r => require.ensure( [] , () => r(require('../business/login/bindMobile')) , 'bindMobile' );
const map              = r => require.ensure( [] , () => r(require('../business/map/map')) , 'map');
const singlePosition   = r => require.ensure( [] , () => r(require('../business/map/singlePosition')) , 'singlePosition');
const demand           = r => require.ensure( [] , () => r(require('../business/demand/demand')) , 'demand');
const mydemand         = r => require.ensure( [] , () => r(require('../business/demand/mydemand')) , 'mydemand');
const demandDetail     = r => require.ensure( [] , () => r(require('../business/demand/demandDetail')) , 'demandDetail');
const demandSuccess    = r => require.ensure( [] , () => r(require('../business/demand/success')) , 'demandSuccess');
const invite           = r => require.ensure( [] , () => r(require('../business/invite/invite')) , 'invite');
const invited          = r => require.ensure( [] , () => r(require('../business/invite/invited')) , 'invited');
const cart             = r => require.ensure( [] , () => r(require('../business/cart/cart')) , 'cart');
const comment          = r => require.ensure( [] , () => r(require('../business/comment/comment')) , 'comment');
const commentDetail    = r => require.ensure( [] , () => r(require('../business/comment/commentDetail')) , 'commentDetail');
const care             = r => require.ensure( [] , () => r(require('../business/care/care')) , 'care');
const myorder          = r => require.ensure( [] , () => r(require('../business/order/myorder')) , 'myorder');
const submitOrder      = r => require.ensure( [] , () => r(require('../business/order/submitOrder')) , 'submitOrder');
const submittedOrderDetail = r => require.ensure( [] , () => r(require('../business/order/submittedOrderDetail')) , 'submittedOrderDetail');
const smallorderDetail = r => require.ensure( [] , () => r(require('../business/order/smallorderDetail')) , 'smallorderDetail');
const bigorderDetail   = r => require.ensure( [] , () => r(require('../business/order/bigorderDetail')) , 'bigorderDetail');
const paySuccess       = r => require.ensure( [] , () => r(require('../business/order/paySuccess')) , 'paySuccess');
const groupSuccess     = r => require.ensure( [] , () => r(require('../business/fightGroups/paySuccess')) , 'groupSuccess');
const group            = r => require.ensure( [] , () => r(require('../business/fightGroups/group')) , 'group');
const groupDesc        = r => require.ensure( [] , () => r(require('../business/fightGroups/children/groupDesc')) , 'groupDesc');
const groupDetail      = r => require.ensure( [] , () => r(require('../business/fightGroups/groupDetail')) , 'groupDetail');
const groupInfo        = r => require.ensure( [] , () => r(require('../business/fightGroups/children/groupInfo')) , 'groupInfo');

const facilitatorlist  = r => require.ensure( [] , () => r(require('../business/facilitator/facilitatorlist')) , 'facilitatorlist');
const facilitatorDetail= r => require.ensure( [] , () => r(require('../business/facilitator/facilitatorDetail')) , 'facilitatorDetail');
const caseDetail       = r => require.ensure( [] , () => r(require('../business/facilitator/caseDetail')) , 'caseDetail');
const gradeDesc        = r => require.ensure( [] , () => r(require('../business/admin/gradeDesc')) , 'gradeDesc');
const dealVoucher      = r => require.ensure( [] , () => r(require('../business/order/dealVoucher')) , 'dealVoucher');
const mall             = r => require.ensure( [] , () => r(require('../business/mall/malls')) , 'mall');
const myInvoice        = r => require.ensure( [] , () => r(require('../business/invoice/myInvoice')) , 'myInvoice');
const invoiceDetail    = r => require.ensure( [] , () => r(require('../business/invoice/invoiceDetail')) , 'invoiceDetail');
const thematic         = r => require.ensure( [] , () => r(require('../business/thematic/thematic')) , 'thematic');
const thematicDetail   = r => require.ensure( [] , () => r(require('../business/thematic/thematicDetail')) , 'thematicDetail');
const applyInvoice     = r => require.ensure( [] , () => r(require('../business/invoice/applyInvoice')) , 'applyInvoice');
const makeupInvoice    = r => require.ensure( [] , () => r(require('../business/invoice/makeupInvoice')) , 'makeupInvoice');
const invoicePaySuccess       = r => require.ensure( [] , () => r(require('../business/invoice/paySuccess')) , 'invoicePaySuccess');
const walletFill       = r => require.ensure( [] , () => r(require('../business/payment/walletFill')) , 'walletFill');

 // 404
 const NotFoundPage     = r => require.ensure( [] , () => r(require('../business/pulic/NotFoundComponent')) , 'NotFoundPage');
 // const ours             = r => require.ensure( [] , () => r(require('../business/ours/aboutwe')) , 'ours')
 /*
 *  gourd end
 */
/*
fiveTrees start...
*/
const help             = r => require.ensure( [] , () => r(require('../business/help/help')), 'help');
const article          = r => require.ensure( [] , () => r(require('../business/article/article')), 'article');
const address          = r => require.ensure( [] , () => r(require('../business/address/address')), 'address');
const editAddress      = r => require.ensure( [] , () => r(require('../business/address/children/editAddress')), 'editAddress');
const addAddress       = r => require.ensure( [] , () => r(require('../business/address/children/addAddress')), 'addAddress');
const profile          = r => require.ensure( [] , () => r(require('../business/admin/profile')) , 'profile');
const userProfile      = r => require.ensure( [] , () => r(require('../business/userProfile/userProfile')), 'userProfile');
const editName         = r => require.ensure( [] , () => r(require('../business/userProfile/children/editName')), 'editName');
const editEmail        = r => require.ensure( [] , () => r(require('../business/userProfile/children/editEmail')), 'editEmail');
const changeMobile     = r => require.ensure( [] , () => r(require('../business/userProfile/children/changeMobile')), 'changeMobile');
const changePassword   = r => require.ensure( [] , () => r(require('../business/userProfile/children/changePassword')), 'changePassword');
const accountBound     = r => require.ensure( [] , () => r(require('../business/userProfile/children/accountBound')), 'accountBound');
const point            = r => require.ensure( [] , () => r(require('../business/userProfile/point')), 'point');
const company          = r => require.ensure( [] , () => r(require('../business/userProfile/company')), 'company');
const industry         = r => require.ensure( [] , () => r(require('../business/userProfile/children/industry')), 'industry');

/*
fiveTrees end
*/

const wallet           = r => require.ensure( [] , () => r(require('../business/wallet/wallet')) , 'wallet');
const walletDetail     = r => require.ensure( [] , () => r(require('../business/wallet/children/walletDetail')) , 'walletDetail');
const walletPassword   = r => require.ensure( [] , () => r(require('../business/wallet/children/walletPassword')) , 'walletPassword');
const walletSuccess    = r => require.ensure( [] , () => r(require('../business/wallet/children/success')) , 'walletSuccess');
const consumptionDetail= r => require.ensure( [] , () => r(require('../business/wallet/children/children/detail')) , 'detail');
const paymentMode      = r => require.ensure( [] , () => r(require('../business/payment/payment')) , 'paymentMode' );
const offline          = r => require.ensure( [] , () => r(require('../business/offline/offline')) , 'offline' );
const message          = r => require.ensure( [] , () => r(require('../business/message/message')) , 'message' );



// app加载wap有用户权限限制的   单独路由配置
 /* 需求模块 */
 const appDemand             =  () => import('../AppPage/demand/demand.vue') ;
 const appDemandDetail       =  () => import('../AppPage/demand/demandDetail.vue');
 const appMyDemand           =  () => import('../AppPage/demand/mydemand.vue');
 const appDemandSuccess      =  () => import('../AppPage/demand/success.vue');
 /* 订单模块*/
 const appBigorderDetail       = () => import('../AppPage/order/bigorderDetail.vue');
 const appSmallorderDetail     = () => import('../AppPage/order/smallorderDetail.vue');
 const appDealVoucher          = () => import('../AppPage/order/dealVoucher.vue');
 const appSubmittedorderDetail = () => import('../AppPage/order/submittedOrderDetail.vue');
 /* 服务商 */
 const appFacilitatorlist     =  () => import('../AppPage/facilitator/facilitatorlist.vue');
 const appFacilitatorDetail   =  () => import('../AppPage/facilitator/facilitatorDetail.vue');
 const appCaseDetail          =  () => import('../AppPage/facilitator/caseDetail.vue');
 /* 拼团说明 */
 const appGroupDesc           = () => import('../AppPage/group/groupDesc.vue');
 /* 票据详情 */
 const appInvoiceDetail       = () => import('../AppPage/invoice/invoiceDetail.vue');
  /* 会员等级说明 */
 const appLevelDesc           = () => import('../AppPage/level/gradeDesc.vue');
 /* 帮助中心 */
 const appHelp                = () => import('../AppPage/help/help.vue');
 /* 邀请有奖 */
 const appInvite              = () => import('../AppPage/invite/invite.vue');
 /* 积分列表 */
 const appPoint               = () => import('../AppPage/point/point.vue' );
 /* 文章列表 */
 const appArticle             = () => import('../AppPage/article/article.vue');
 /* 活动详情 */
 const appActivities          = () => import('../AppPage/activities/activitiesDetail.vue');
 /* 场地详情 */
 const appFields              = () => import('../AppPage/fields/fieldsDetail.vue');
 /* 特色主题展 */
 const appThematic            = () => import('../AppPage/thematic/thematic.vue');
 /* 特色主题展详情 */
 const appThematicDetail      = () => import('../AppPage/thematic/thematicDetail.vue');

export default [{
  path : '/',
  component : APP ,
  children : [
// 地址为空时，定位到商家主页

    {
      path : '' ,
      redirect : '/home'
    },
    // 组件封装路由
    {
      path : '/com' ,
      component : com
    },
/**
* 商家端路由配置
*/
    // 官网首页
    {
      path : '/home',
      name : 'home' ,
      component : home
    },
    // 切换城市界面
    {
      path : '/home/city',
      component : city
    },
    // 搜索界面
    {
      path : '/search' ,
      component : search
    },
    // 场地列表
    {
      path : '/fields',
      name : 'fields' ,
      component : fields,
      children : [{
        path : 'filter',
        component : filter
      }]
    },
    // 场地类型列表
    {
      path : '/fieldtypeList',
      component : fieldtypeList
    },
    // 场地详情
    {
      path : '/fields/fieldsDetail/:id' ,
      name : 'fieldsDetail' ,
      component : fieldsDetail,
      children : [{
        path : 'fieldInfo',
        component : fieldInfo,
        name : 'fieldinfo'
      }]
    },
    // 活动列表
    {
      path: '/activities',
      component : activities ,
      name : 'activities',
      children : [{
        path : 'acfilter',
        component : acfilter
      }]
    },
    // 活动详情
    {
      path : '/activities/activitiesDetail/:id' ,
      component : activitiesDetail,
      name : 'activitiesDetail',
      children : [{
        path : 'actInfo',
        component : actInfo,
        name : 'actinfo'
      }]
    },
    // 广告列表
    {
      path: '/ads',
      component : ads
    },
    // 广告详情
    {
      path : '/ads/adsDetail/:id' ,
      component : adsDetail,
      name : 'adsDetail'
    },
    // 专题列表
    {
      path: '/themes',
      component : themes
    },
    // 专题详情
    {
      path : '/themes/themesDetail/:id' ,
      component : themesDetail,
      name : 'themesDetail'
    },
    // 登录模块
    {
      path : '/login' ,
      component : login ,
      name : 'login' ,
      children : [
        // 快捷登录
        {
          path : 'mobilelogin' ,
          component : mLogin
        },
        // 找回密码
        {
          path : 'findpassword' ,
          component : findPassword
        }
      ]
    },
    // 注册
    {
      path : '/register' ,
      component : register
    },
    // 绑定手机号
    {
      path: '/bindMobile',
      component: bindMobile,
      name: 'bindMobile'
    },
    // 地图查找
    {
      path : '/map' ,
      component : map
    },
    // 单点地图查找功能
    {
      path : '/singlePosition' ,
      component : singlePosition
    },
    // 发布需求
    {
      path : '/demand' ,
      component : demand ,
      meta : { requiresAuth : true }
    },
    // 发布需求成功
    {
      path : '/demand/success',
      component : demandSuccess
    },
    // 需求主页
    {
      path : '/mydemand',
      component : mydemand,
      meta : { requiresAuth : true },
      name : 'mydemand'
    },
    // 需求详情
    {
      path : '/mydemand/demandDetail/:id',
      component : demandDetail,
      name : 'demandDetail'
    },
    // 帮助
    {
      path : '/help' ,
      component : help,
      name: 'help',
      meta: { keepAlive: true }
    },
    // 文章
    {
      path: '/article/:id',
      component: article,
      name: 'article',
    },
    // 联系人
    {
      path: '/address',
      component: address,
      name: 'address',
      meta:{ requiresAuth:true },
      children: [
        // 编辑
        {
          path: 'editAddress/:id',
          component: editAddress,
          name:'editAddress'
        },
        // 增加
        {
          path: 'addAddress',
          component: addAddress,
          name: 'addAddress'
        }
      ]
    },
    // 我的
    {
      path: '/admin/profile',
      component: profile
    },
    // 消息列表
    {
      path: '/message',
      component: message,
      name: 'message',
      meta: {
        requiresAuth: true
      }
    },
    // 用户资料
    {
      path: '/userProfile',
      component: userProfile,
      name: 'userProfile',
      meta: {
        requiresAuth: true
      },
      children: [
        // 编辑姓名
        {
          path: 'editName',
          component: editName,
          name: 'editName'
        },
        // 编辑邮箱
        {
          path: 'editEmail',
          component: editEmail,
          name: 'editEmail'
        },
        // 换绑手机号
        {
          path: 'changeMobile',
          component: changeMobile,
          name: 'changeMobile'
        },
        // 修改密码
        {
          path: 'changePassword',
          component: changePassword,
          name: 'changePassword'
        },
        // 第三方账号 解绑、绑定
        {
          path: 'accountBound',
          component: accountBound,
          name: 'accountBound'
        },
      ]
    },
    // 积分
    {
      path: '/point',
      component: point,
      name: 'point',
       meta: {
        requiresAuth: true
      },
    },
    // 公司信息
    {
      path: '/company',
      component: company,
      name: 'company',
      meta: {
        requiresAuth: true
      },
      children:[
        // 公司行业选择
        {
          path: 'industry',
          component: industry,
          name: 'industry'
        }
      ]

    },

    // 钱包
    {
      path: '/wallet',
      component: wallet,
      name: 'wallet',
      children: [
        {
          path: 'walletDetail',
          component: walletDetail,
          name: 'walletDetail',
          children: [
            {
              path: ':id',
              component: consumptionDetail,
              name: 'consumptionDetail'
            }
          ]
        },
        {
          path: 'walletPassword',
          component: walletPassword,
          name: 'walletPassword'
        },
        {
          path: 'success',
          component: walletSuccess,
          name: 'walletSuccess'
        }
      ]
    },
    // 钱包充值
    {
      path : '/walletFill',
      component : walletFill,
      meta : { requiresAuth : true }
    },
    // 购物车
    {
      path : '/cart',
      component : cart,
      meta : { requiresAuth : true }
    },
    // // 关于我们
    // {
    //   path : '/ours' ,
    //   component : ours,
    //   meta : { keepAlive : true }
    // },

    // 邀请有奖
    {
      path : '/invite' ,
      component : invite,
      meta :{ requiresAuth : true }
    },
    // 邀请好友进入的页面
    {
      path : '/invited' ,
      component : invited
    },
    // 发表评论
    {
      path : '/comment/:id',
      component : comment,
      name : 'comment'
    },
    // 评价详情
    {
      path : '/comment/commentDetail/:id',
      component : commentDetail ,
      name : 'commentDetail',
      meta :{ requiresAuth : true }
    },

    {
      path: '/payment',
      component: paymentMode,
      name: 'payment'
    },
    {
      path: '/offline/:id',
      component: offline,
      name: 'offline'
    },
    // 我的关注
    {
      path : '/care',
      component : care
    },

    // 票据成功页
    {
      path: '/invoice/paySuccess',
      component: invoicePaySuccess
    },
    // 提交订单
    {
      path : '/submitOrder' ,
      component : submitOrder ,
      meta : { requiresAuth : true }
    },
    // 我的订单
    {
      path : '/myorder' ,
      component : myorder ,
      meta : { requiresAuth : true  },
    },
    // 小订单详情
    {
      path : '/smallorderDetail/:id',
      component : smallorderDetail ,
      name : 'smallOrderDetail' ,
      meta : { requiresAuth : true }

    },
    // da订单详情
    {
      path : '/bigorderDetail/:id',
      component : bigorderDetail ,
      name : 'bigOrderDetail',
      meta : { requiresAuth : true }

    },
    // 待支付订单详情
    {
      path : '/submittedOrderDetail/:id',
      component : submittedOrderDetail ,
      meta : { requiresAuth : true },
      name : 'submittedOrderDetail'
    },
    // 订单支付成功
    {
      path : '/order/paySuccess' ,
      component : paySuccess
    },
    // 拼团列表
    {
      path : '/group' ,
      component : group,
    },
  // 拼团说明
    {
      path : '/group/groupDesc',
      component : groupDesc,
      meta : { keepAlive : true }
    },
    // 拼团详情
    {
      path : '/group/groupDetail/:id' ,
      component : groupDetail,
      name : 'groupDetail',
      children:[
        {
          path : 'groupInfo',
          component : groupInfo,
          name : 'groupInfo'
        }
      ]
    },
    // 拼团成功
    {
      path : '/group/paySuccess',
      component : groupSuccess
    },
    // 服务商列表
    {
      path : '/facilitatorlist',
      component : facilitatorlist
    },
    // 服务商详情
    {
      path : '/facilitatorlist/facilitatorDetail/:id',
      component : facilitatorDetail,
      name : 'facilitatorDetail'
    },
    // 服务商详情
    {
      path : '/facilitatorlist/caseDetail/:id',
      component : caseDetail,
      name : 'caseDetail'
    },
    //会员等级说明
    {
      path : '/admin/gradeDesc' ,
      component : gradeDesc
    },
    // 交易凭证
    {
      path : '/order/dealVoucher/:id',
      component: dealVoucher,
      name : 'dealVoucher',
      meta : {
        requiresAuth : true
      }
    },
    // 自营商城
    {
      path : '/mall' ,
      component : mall
    },
    // 我的发票
    {
      path : '/myInvoice',
      component : myInvoice ,
      meta : {
        requiresAuth : true
      }
    },
    // 票据详情
    {
      path : '/invoiceDetail/:id',
      component : invoiceDetail,
      name:'invoiceDetail',
      meta : {
        requiresAuth : true
      }
    },
    // 补开发票
    {
      path : '/makeupInvoice',
      component : makeupInvoice,
      meta : {
        requiresAuth : true
      }
    },
    // 申请票据
    {
      path : '/applyInvoice/:id',
      component : applyInvoice,
      name : 'applyInvoice',
      meta : {
        requiresAuth : true
      }
    },
    // 特色主题展
    {
      path : '/thematic',
      component : thematic
    },
    // 特色主题展详情
    {
      path : '/thematic/thematicDetail/:id',
      component : thematicDetail,
      name : 'thematicDetail'
    },
// -----------------------------------------------------------------------------
/**
* APP加载wap路由配置
*/
    // 发布需求
    {
      path : '/appDemand' ,
      component : appDemand
    },
    // 需求详情
    {
      path : '/appDemandDetail/:id' ,
      component : appDemandDetail,
      name : 'appDemandDetail'
    },
    // 我的需求
    {
      path : '/appMyDemand' ,
      component : appMyDemand
    },
    // 发布需求成功
    {
      path : '/appDemandSuccess' ,
      component : appDemandSuccess
    },
    // 订单模块
      // 大订单详情
    {
      path : '/appBigorderDetail/:id' ,
      component : appBigorderDetail ,
      name : 'appBigorderDetail'
    },
     // 小订单详情
    {
      path : '/appSmallorderDetail/:id' ,
      component : appSmallorderDetail ,
      name : 'appSmallorderDetail'
    },
     // 待支付大订单详情
    {
      path : '/appSubmittedorderDetail/:id' ,
      component : appSubmittedorderDetail ,
      name : 'appSubmittedorderDetail'
    },
     // 交易凭证
    {
      path : '/appDealVoucher/:id' ,
      component : appDealVoucher ,
      name : 'appDealVoucher'
    },
    // 服务商模块
      // 服务商列表
    {
      path : '/appFacilitatorlist',
      component : appFacilitatorlist
    },
     // 服务商详情
    {
      path : '/appFacilitatorDetail/:id',
      component : appFacilitatorDetail,
      name : 'appFacilitatorDetail'
    },
     // 案例详情
    {
      path : '/appCaseDetail/:id',
      component : appCaseDetail ,
      name : 'appCaseDetail'
    },
   // 拼团说明
    {
      path : '/appGroupDesc',
      component : appGroupDesc
    },
    // 票据详情
    {
      path : '/appInvoiceDetail/:id' ,
      component : appInvoiceDetail,
      name : 'appInvoiceDetail'
    },
    // 会员等级说明
    {
      path : '/appLevelDesc' ,
      component : appLevelDesc
    },
    // 帮助中心
    {
      path : '/appHelp' ,
      component : appHelp
    },
    // 邀请有奖页面
    {
      path : '/appInvite' ,
      component : appInvite
    },
    //  积分列表
    {
      path : '/appPoint' ,
      component : appPoint
    },
    //  文章列表
    {
      path : '/appArticle/:id' ,
      component : appArticle,
      name : 'appArticle'
    },
    //  活动详情
    {
      path : '/appActivities/:id' ,
      component : appActivities,
      name : 'appActivities'
    },
    //  场地详情
    {
      path : '/appFields/:id' ,
      component : appFields,
      name : 'appFields'
    },
    //  特色主题展
    {
      path : '/appThematic' ,
      component : appThematic,
      name : 'appThematic'
    },
    //  特色主题展详情
    {
      path : '/appThematicDetail/:id' ,
      component : appThematicDetail,
      name : 'appThematicDetail'
    },
    // 404页面
    {
      path: '*',
      component: NotFoundPage
    }
 ]
}]
