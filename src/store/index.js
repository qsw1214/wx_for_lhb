import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'


Vue.use(Vuex)

const state = {
  config:null,
  cityName : '' , // 用户当前城市
  cityId : '', // 整个项目城市id
  userInfo : null, //用户信息
  userProfile:null,//用户详细信息
  citys : null , // 已开通城市
  login : false , // 登录状态
  editAddress:{},//待编辑的联系人详情
  paymentModel : {} ,// 支付方式需要的参数
  filterData : {} , // 资源筛选条件
  commentResource : {} , // 要评论的资源
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
