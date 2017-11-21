
import { setStorage, setSession ,getSession} from 'src/config/tools' ;
export default {
  // 刷新页面 重新记录用户信息
  RE_RECORD_INFO(state,info){
    state.userInfo = getSession('userInfo');
    state.login = getSession('login');
    state.userProfile = getSession('userProfile');
  },
  // 记录用户信息
  RECORD_USERINFO (state, info) {
    state.userInfo = info;
    state.login = true;
    setSession('userInfo', info);
    setSession('login', true);
  },
  //退出登录
  LOGOUT(state) {
    state.userInfo = null;
    state.login = false;
    setSession('userInfo', null);
    setSession('login', false);
  },
  // 记录用户详细信息
  RECORD_USERPROFILE (state, info) {
    if (!state.login) {
      return;
    }
    state.userProfile = { ...info} ;
    setSession('userProfile', info);
  },
  // 记录配置文件
  RECORD_CONFIG(state, info) {
    state.config = { ...info };
    setStorage('config', info);
  },
  // 记录城市名
  RECORD_CITYNAME (state,city){
    state.cityName = city;
    setStorage('cityName' , city );
  },
  // 记录城市id
  RECORD_CITY (state , cityid ){
    state.cityId = cityid ;
    setStorage('cityId' , cityid);
  },
  // 开通的所有的城市
  ALL_CITYS(state , citys){
    state.citys = citys ;
  },
  // 记录待编辑的联系人详情
  RECORD_EDIT_ADDRESS(state,editAddress){
    state.editAddress = editAddress;
  },

  // 记录场地的筛选条件
  RECORD_FILTERDATA( state , filterData ){
    state.filterData = filterData ;
  },

  // 记录当前要评论的订单
  COMMENT_RESOURCE(state , obj){
    state.commentResource = obj ;
  },
  // 记录支付方式页需要的参数
  RECORD_PAYMENTMODEL(state , obj){
    state.paymentModel = obj ;
  }

}
