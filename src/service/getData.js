
import ajax from 'src/config/ajax'
import { headers } from 'src/config/data'
import { setStorage, getStorage } from 'src/config/tools';

/**
 * 获取配置信息
 */
export const getConfig = (version=0) => ajax({
  url: '/api/configurations',
  params: { version: version},
  headers: headers(3)
})
/**
* 获取城市列表
*/
export const getCitys = () => ajax({
  url : '/api/city/located'
})
// 省市区三级 列表
export const getAddressList = () => {
  return new Promise((resolve, reject) => {
    let addressList = getStorage('addressList');
    if (addressList) {
      resolve(addressList)
    } else {
      ajax({
        url: '/api/inner/province/province-list',
        headers: headers(1)
      }).then(res => {
        resolve(res.result)
        setStorage('addressList', res.result);
      }).catch(e => {
        reject(e)
      })
    }

  })
}
/**
 * 获取当前城市
 */
export const getCurrentCity = () => ajax({
  url : '/api/current_location'
})
/**
* 获取首页banner图
*/
export const getBanners = ( city_id ) => ajax({
  url : '/api/banners' ,
  params : {
    city_id : city_id ,
    type : 'home' ,
    page : 1 ,
    pageSize : 8
  }
})
/**
 * 获取商圈列表
 */
export const getTrading = (id) => ajax({
  url : '/api/trading-area' ,
  params : {
    city_id : id
  }
})
/**
 * 获取标签列表
 */
export const getLabels = (id) => ajax({
  url : '/api/label',
  params : {
    city_id : id
  }
})
/**
* 获取资源列表
*/
export const getResources = (integrant) => ajax({
  url : '/api/resources' ,
  params : integrant,
  headers : headers(2)
})
/**
 * 获取资源详情
 */
export const getResourcesDetail = ( id , integrant ) => ajax({
  url: '/api/resources/'+ id ,
  params : integrant ,
  headers : headers(4)
})
/**
 * 获取社区的其他资源接口
 */
export const getOtherResources = ( id , obj ) => ajax({
  url: '/api/communities/'+id+'/other_resources' ,
  params : obj ,
  headers : headers(2)
})
/**
 * 获取指定资源的评论列表
 */
export const getResourcesComments = ( id , obj ) => ajax({
  url: '/api/selling_resources/'+id+'/comments' ,
  params : obj ,
  headers : headers(2)
})
/**
 * 获取资源详情页推荐资源列表
 */
export const getRecommendingResources = ( obj ) => ajax({
  url: '/api/recommending_resources/details' ,
  params : obj ,
  headers : headers(2)
})
/**
 *  添加到收藏
 */
export const addFavorite = ( id ) => ajax({
  url: '/api/resources/'+id+'/favorite' ,
  method : 'PUT',
  headers : headers(2)
})
/**
 *  移除收藏
 */
export const removeFavorite = ( id ) => ajax({
  url: '/api/resources/'+id+'/favorite' ,
  method : 'DELETE',
  headers : headers(1)
})


/**
* 获取专题列表
*/
export const getThemes = ( obj ) => ajax({
  url : '/api/themes' ,
  params : obj
})
/**
* 获取专题详情
*/
export const getThemeDetail = ( id ) => ajax({
  url : '/api/themes/'+ id
})
/**
 * 账号登录
 */
export const postLogin = (obj) => ajax({
  method : 'POST' ,
  url : '/api/auth/login' ,
  params : obj
})
/**
 * 退出登录
 */
export const logout = () => ajax({
  method: 'POST',
  url: '/api/auth/logout',
  headers: headers()
})
/**
 *  发送短信验证码 (fiveTrees has edited...)
 */
export const sendMsg = (obj) => ajax({
  url: '/api/auth/app_captcha',
  params: obj,
  method:'post'
})
/**
 *  发送短信验证码
 */
export const sendCode = (obj) => ajax({
  url: '/api/auth/captcha',
  params: obj
})
/**
 * 验证验证码的有效性
*/
export const captchaBoolean = ( obj ) => ajax({
  method : 'POST' ,
  url : '/api/auth/validate_captcha' ,
  params : obj
})
/**
 * 快速登录接口
 */
export const fastLogin = ( obj ) => ajax({
  method : 'POST' ,
  url : '/api/auth/fast_login' ,
  params : obj
})
/**
 *  注册接口
 */
export const register = ( obj ) => ajax({
  method : 'POST' ,
  url : '/api/auth/register' ,
  params : obj
})
/**
 * 重置密码
 */
export const resetPassword = ( obj ) => ajax({
  method : 'POST' ,
  url : '/api/auth/reset_password' ,
  params : obj
})
/**
 * 公众号微信登录
 */
export const wechatLogin = ( obj ) => ajax({
  method : 'POST' ,
  url : '/api/auth/official_account_wechat_login',
  params : obj
})

/**
 * 绑定手机号
 */
export const bindMobile = ( obj ) => ajax({
  method : 'POST' ,
  url : '/api/auth/bind_mobile',
  headers:  headers(1),
  params : obj
})

/**
 *  获取搜索热词
 */
export const hotWord = ( obj ) => ajax({
  url : '/api/hot_words' ,
  params : obj
})

/**
 * 获取需求的各项信息
 */
export const getDemandInfo = ( ) => ajax({
  url : '/api/company_information'
})

/**
 *  获取help页面
 */
export const getHelp = () => ajax({
  url: '/api/articles',
  params: {
    page:1,
    pageSize: 999,
    position: 'help'
  }
})
/**
 *  获取文章 (帮助页面详情)
 */
export const getArticle = id => ajax({
  url: '/api/articles/'+id,
})

/**
 *  获取联系人列表
 */
export const getAddress = (params) => ajax({
  url: '/api/address',
  headers:  headers(1),
  params
})
/**
 *  编辑联系人（以及设置默认联系人）
 */
export const editAddress = params => ajax({
  url: '/api/address/' + params.id,
  headers: headers(1),
  method: 'post',
  params
})
/**
 *  获得默认联系人
 */
export const getDefaultAddress = () => ajax({
  url: '/api/default_address',
  headers: headers(1),
  method: 'get',
})
/**
 *  删除联系人
 */
export const deleteAddress = id => ajax({
  url: '/api/address/'+id,
  headers: headers(1),
  method: 'delete',
})
/**
 *  添加联系人
 */
export const addAddress = (params) => ajax({
  url: '/api/address',
  headers: headers(1),
  params,
  method: 'post',
})
/**
*发布默认填写信息 
*/
export const getDefaultAppealsInfo = () => ajax({
  url: '/api/appeal/create',
  headers: headers(3)
})

/**
 * 提交需求
 */
export const postDemand = obj => ajax({
  method : 'POST',
  url : '/api/appeal' ,
  params : obj,
  headers: headers(3)
})
/**
 *  获取我的需求列表
 */
export const getMyDemand = ( obj ) => ajax({
  url : '/api/appeal',
  params : obj,
  headers : headers(2)
})
/**
 *  获取需求详情
 */
export const getDemandDetail = ( id ) => ajax({
  url : '/api/appeal/'+ id,
  headers : headers(2)
})

/**
* 获取用户信息详情
*/

export const getProfile = () => ajax({
  url: '/api/users/profile',
  headers: headers(3)
})
/**
* 个人信息-更改头像
*/
export const setUserAvatar = avatar => ajax({
  url: '/api/profile',
  method: 'put',
  headers: headers(1),
  params: {
    avatar: avatar
  }
})
/**
* 个人信息-更改姓名
*/
export const setUserName = name => ajax({
  url: '/api/profile',
  method: 'put',
  headers: headers(1),
  params:{
    name:name
  }
})
/**
* 个人信息-更改邮箱
*/
export const setUserEmail = email => ajax({
  url: '/api/profile',
  headers: headers(1),
  method: 'put',
  params: {
    email:email
  }
})
/**
* 个人信息-更改手机号
*/
export const setUserMobile = params => ajax({
  url: '/api/auth/change_mobile',
  method: 'post',
  headers: headers(1),
  params: params
})
/**
 * 个人信息-更改密码
 */
export const setUserPassword = params => ajax({
  url: '/api/users/password',
  headers: headers(1),
  method: 'post',
  params: params
})
/**
* 个人信息-解绑微信号
*/
export const unbindWechat = () => ajax({
  url: '/api/auth/unbind_wechat',
  method: 'post',
  headers: headers(1),
})
/**
* 个人信息-绑定微信号
*/
export const bindWechat = (code) => ajax({
  url: '/api/auth/bind_wechat',
  method: 'post',
  headers: headers(1),
  params: {
    platform_type:2,
    code:code
  }
})
/**
* 个人信息-积分列表
*/
export const getPoint = (params) => ajax({
  url: '/api/point_histories',
  method: 'get',
  headers: headers(2),
  params: params
})
/**
* 个人信息-公司信息
*/
export const getCompanyInfo = () => ajax({
  url: '/api/users/company_info',
  method: 'get',
  headers: headers(3)
})
// 保存当前用户的公司信息
export const postCompanyInfo = params => ajax({
  url: '/api/users/company_info',
  method: 'POST',
  headers: headers(3),
  params

})

/**
* 公司信息-公司行业
*/
export const getIndustry = () => ajax({
  url: '/api/industries',
  method: 'get',
  headers: headers(2)
})

/**
* 获取个人资料
*/
export const userInfo = () => ajax({
  url : '/api/users/profile',
  headers: headers(3),
  method: 'get'
})

/**
* 获取钱包信息接口
*/
export const walletInfo = () => ajax({
  url : '/api/wallets',
  headers: headers(2),
  method: 'get'
})

/**
* 获取钱包交易明细列表接口
*/
export const walletDetail = (obj) => ajax({
  url: '/api/transactions',
  headers: headers(2),
  params : obj,
  method: 'get'
})

/**
* 钱包充值明细中取消付款接口
*/
export const deleteWallet = (id) => ajax({
  url: '/api/transactions/' + id,
  headers: headers(2),
  method: 'delete'
})

/**
*  获取邀请列表
*/
export const getInvite = (obj) => ajax({
  url : '/api/invite',
  params : obj,
  headers : headers(1)
})
/**
 * 获取微信分享配置信息
 */
export const wechatConfig = () => ajax({
  url : '/api/wechat/share',
  headers : headers(1)
})

/**
* 设置钱包的支付密码
*/
export const walletPwd = (obj) => ajax({
  url: '/api/wallets',
  headers: headers(2),
  method: 'post',
  params: obj
})

/**
* 重置钱包的支付密码
*/
export const walletPwdReset = (obj) => ajax({
  url: '/api/wallets',
  headers: headers(2),
  method: 'put',
  params: obj
})

/**
* 钱包充值
*/
export const payWallet = (obj) => ajax({
  url: '/api/transactions',
  headers: headers(2),
  method: 'post',
  params: obj
})

/**
* 钱包充值选择对公打款
*/
export const walletOffline = (id,obj) => ajax({
  url: '/api/transactions/' + id + '/upload_voucher',
  headers: headers(2),
  method: 'put',
  params: obj
})

/**
* 钱包充值详情
*/
export const walletPayDetail = (id) => ajax({
  url: '/api/transactions/' + id,
  headers: headers(2),
  method: 'get'
})

/**
* 订单支付选择对公打款
*/
export const orderOffline = (id,obj) => ajax({
  url: '/api/orders/' + id + '/upload_voucher',
  headers: headers(2),
  method: 'put',
  params: obj
})

/**
* 订单支付：根据id获取订单详情
*/
export const orderDetail = (id) => ajax({
  url: '/api/orders/' + id,
  headers: headers(3),
  method: 'get'
})

/**
* 获取订单支付选择对公打款时的收款信息
*/
export const getGathering = (id) => ajax({
  url: '/api/payment/orders/' + id ,
  headers: headers(2),
  method: 'get'
})
/**
 * 获取我的关注列表
 */
export const getMycare = ( obj ) => ajax({
  url : '/api/favorites',
  params : obj,
  headers: headers(1)
})
/**
 * 取消关注
 */
export const cancleCare = (id) => ajax({
  url : '/api/resources/'+ id + '/favorite',
  method : 'DELETE',
  headers : headers(1)
})

/**
* 获取当前用户提醒标记接口
*/
export const getBadge = () => ajax({
  url: '/api/users/current/badge_info',
  headers: headers(2),
  method: 'get'
})

/**
* 获取用户消息列表
*/
export const getMessage = (id,obj) => ajax({
  url: '/api/users/' + id + '/user_messages',
  headers: headers(2),
  method: 'get',
  params: obj
})

/**
* 标记消息为已读
*/
export const badgeMessage = (id,ids) => ajax({
  url: '/api/users/' + id + '/user_messages/' + ids + '/read',
  headers: headers(2),
  method: 'put'
})

/**
* 票据支付接口
*/
export const payInvoices = (id,obj) => ajax({
  url: '/api/invoice_orders/' + id,
  headers: headers(1),
  method: 'post',
  params: obj
})

/**
* 订单支付接口
*/
export const payOrders = (id,obj) => ajax({
  url: '/api/orders/' + id,
  headers: headers(4),
  method: 'post',
  params: obj
})
/**
 * 获取特色主题展
 */
export const getThemenShow = (obj) => ajax({
  url : '/api/articles',
  params : obj
})
/**
 * 获取合作案例
 */
export const getCase = () => ajax({
  url : '/api/articles',
  params : {
    page : 1,
    pageSize : 5,
		position : 'case'
  }
})
/**
 * 获取首页分类
 */
export const getCategory = () => ajax({
  url : '/api/admin/hot_category'
})
/**
 * 提交评论
 */
export const postComments = (id, params) => ajax({
  url : '/api/order_items/'+id+'/comments',
  method : 'post',
  params: params,
  headers : headers(2)
})
/**
 * 获取指定资源评价列表
 */
export const getCommentsList = ( id , page ) => ajax({
  url : '/api/selling_resources/'+id+'/comments',
  params : { page : page , pageSize : 10 },
  headers : headers(2)
})
/**
 * 获取评论模块的场地资源
 */
export const getCommentResource = ( id ) => ajax({
  url : '/api/resource_info',
  params : { field_order_item_id : id },
  headers : headers(1)
})
/**
 * 获取大订单列表
 */
export const getOrderList = ( params ) => ajax({
  url : '/api/orders',
  headers : headers(3) ,
  params : params
})
/**
 * 获取小订单列表
 */
export const getSmallOrderList = ( params ) => ajax({
  url : '/api/purchased_resources',
  headers : headers(2) ,
  params : params
})
/**
 * 大订单详情 /api/orders/:id
 */

export const getOrdersDetail = id => ajax({
  url: `/api/orders/${id}`,
  headers: headers(3)
})
/**
 * 小订单行详情 /api/order_items/:id/
 */
export const getOrderItemDetail = id => ajax({
  url: `/api/order_items/${id}`,
  headers: headers(2)
})

/**
 * 取消订单接口
 */
export const deleteOrder = ( id ) => ajax({
  method: 'DELETE',
  url : '/api/orders/'+ id ,
  headers : headers(1)
})

/**
 *  获取交易凭证
 */
export const getTransactionVoucher = ( id ) => ajax({
  url : '/api/transaction_voucher' ,
  headers : headers(2),
  params : { field_order_item_id : id }
})
/**
 * 获取拼团列表
 */
export const getGroupList = ( params ) => ajax({
  url : '/api/groups',
  params : params
})
/**
 * 获取拼团详情
 */
export const getGroupDetail = ( id ) => ajax({
  url : '/api/groups/'+ id
})
/**
 * 获取拼团订单列表
 */
export const getGroupOrderList = ( params ) => ajax({
  url : '/api/group_purchase_orders',
  params : params,
  headers : headers(1)
})
/**
 * 获取服务商列表
 */
export const getFacilitatorList = (obj) => ajax({
  url : '/api/service_provider',
  params : obj
})
/**
 * 获取服务商详情
 */
export const getFacilitatorDetail = (id) => ajax({
  url : '/api/service_provider/'+ id,
  headers : headers(1)
})
/**
 * 获取服务商相关案例详情
 */
export const getFacilitatorCaseDetail = (id) => ajax({
  url : '/api/cases/' + id,
  headers : headers(1)
})
/**
 * 添加到购物车列表
 */
export const addCartList = (resources) => ajax({
  method: 'POST' ,
  url : '/api/cart_items' ,
  params : resources ,
  headers : headers(2)
})
/**
 * 移除购物车中商品
 */
export const removeCartList = (resources) => ajax({
  method: 'DELETE' ,
  url : '/api/cart_items' ,
  params : resources ,
  headers : headers(1)
})
/**
 * 获取购物车列表
 */
export const getCartList = () => ajax({
  url : '/api/cart_items' ,
  headers : headers(2)
})
/**
 * 获取购物车数量
 */
export const getCartCount = () => ajax({
  url : '/api/cart_items/count' ,
  headers : headers(2)
})
/**
 * 获取用户公司信息完善状态
 */
export const getUserStatus = () => ajax({
  url : '/api/users/profile/status' ,
  headers : headers(3)
})
/**
 * 创建订单
 */
export const buildOrder = (obj) => ajax({
  method : 'POST',
  url : '/api/orders' ,
  headers : headers(6),
  params : obj
})

/**
 *  提交开票申请
 */
export const postApplyInvoice = (obj) => ajax({
  method : 'POST',
  url : '/api/invoice',
  params : obj ,
  headers : headers(3)
})
/**
 *  获取已处理的开票列表
 */
export const getApplyInvoiceList = (obj) => ajax({
  url : '/api/invoice',
  params : obj ,
  headers : headers(1)
})
/**
 *  创建发票订单
 */
export const bulidInvoiceOrder = (obj) => ajax({
  method : 'POST',
  url : '/api/invoice_orders',
  params : obj ,
  headers : headers(1)
})
/**
 *  获取未申请发票/票据的场地详情列表
 */
export const getInvoicesList = (obj) => ajax({
  url : '/api/invoices_list',
  params : obj ,
  headers : headers(2)
})
/**
 *  获取确认票据页面信息
 */
export const getInvoiceInfo = (obj) => ajax({
  url : '/api/invoice/create',
  params : obj ,
  headers : headers(2)
})
/**
 *  获取票据详情页面信息
 */
export const getInvoiceDetail = ( id ) => ajax({
  url : '/api/invoices/'+ id ,
  params : { id : id } ,
  headers : headers(2)
})
/**
 * 获取拼团状态
 */
export const getGroupStatus = ( id ) => ajax({
  url : '/api/group_status/'+ id ,
  params : { id : id } ,
  headers: headers(1)
})
/**
 * 获取拼团状态
 */
export const postFeedBack = ( obj ) => ajax({
  method:'POST',
  url : '/api/feedbacks' ,
  params : obj ,
  headers: headers(2)
})
