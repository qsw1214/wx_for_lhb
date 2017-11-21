<template lang="html">
  <div class="login-wraper">
    <v-head go-back="true">
      <div slot="center-part">登录</div>
      <div slot="right-part" class="rt register">
        <router-link to="/register" tag="a">注册</router-link>
      </div>
    </v-head>
    <form action="javascript:;" class="login-modal">
      <label class="login-com border-1px">
        <span>账号</span>
        <input type="text" placeholder="请输入账号或手机号" class="account" autocomplete="off" v-model="account">
      </label>
      <label class="login-com border-1px">
        <span>密码</span>
        <input type="password" placeholder="请输入密码" class="password" autocomplete="off" v-model="password">
      </label>
    </form>
    <div class="login-submit" @click="login( account , password )">
      登录
    </div>
    <div class="clear other-login">
      <div class="left">
        <router-link :to="{ path : '/login/mobilelogin' , query : this.$route.query }">通过短信验证码直接登录</router-link>
      </div>
      <div class="right">
        <router-link to="/login/findpassword">忘记密码?</router-link>
      </div>
    </div>
    <div class="wx-login-wraper">
      <div class="title">快捷登录方式</div>
      <div class="wx-login" @click="wxLogin">
          <div class="wx-img"></div>
          <div class="wx-text">微信登录</div>
      </div>
    </div>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
  import { MOBILE_REG , PASSWORD_REG , COMPANY_REG} from '../../config/data' ;
  import { postLogin ,wechatLogin , getCurrentCity } from 'src/service/getData' ;
  import { mapState, mapMutations } from 'vuex';
  import { APPID_LOGIN } from 'src/config/data' ;
  export default {
    data () {
      return {
        account : '' ,
        password : ''
      }
    },
    mounted () {
        this.readyWxLogin();
    },
    components : {
      vHead
    },
    methods : {
      ...mapMutations([
          'RECORD_USERINFO'
      ]),
      login (account , password){
        if ( !COMPANY_REG.test(account) ){
            // 手机号输入不对
          this.$vux.toast.text('请输入11位有效手机号或者账号', 'middle') ;
          return ;
        }
        if ( !PASSWORD_REG.test(password) ){
          // 密码包含其他字符
          this.$vux.toast.text('请检查您输入的密码是否为数字和字母', 'middle');
          return ;
        }
        postLogin( { account , password } )
        .then( res => {
          this.RECORD_USERINFO( res.result );
          if(!res.result.mobile) {
            // 跳转到绑定手机号页面
            this.$router.push({ path : '/bindMobile' , query : {redirect : this.$route.query.redirect } });
          }else{
            this.$vux.toast.show({
              text : '登录成功',
              type : 'success',
              width : '25%'
            });
            let redirect = this.$route.query.redirect ;
            if(redirect) {
              this.$router.push( redirect );
            }
            else {
              this.$router.push('/home');
            }
          }
        })
        .catch( err => {
          this.$vux.toast.text(err.msg);
        })
      },
      wxLogin () {
        let appId = APPID_LOGIN() ;
        // 避免第二次授权问题
        let oldCode = this.getQueryString('code') ;
        let temp = '' ;
        if( oldCode ){
          temp = window.location.origin + window.location.hash ;
        }else{
          temp = window.location.href ;
        }
        let redirectUrl = encodeURIComponent( temp );
        let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appId +'&redirect_uri='+ redirectUrl +'&response_type=code&scope=snsapi_userinfo&state=fox#wechat_redirect';
        window.location.href = url ;
      },
      getQueryString(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = window.location.search.substr(1).match(reg);
        if (r != null) {
          return unescape(r[2]);
        }
        return null;
      },
      readyWxLogin () {
        let code = this.getQueryString('code');
        if(!code) {
          return ;
        } else {
          getCurrentCity().then( res => {
            let params = {
              code: code ,
              province_id : res.result.province_id ,
              city_id : res.result.city_id ,
              channel : 'wap'
            } ;
            wechatLogin( params ).then( res => {
                this.RECORD_USERINFO( res.result );
                if(!res.result.mobile) {
                  // 跳转到绑定手机号页面  并且去掉链接中的code 参数，避免授权的bug;
                  let redirect = this.$route.query.redirect ;
                  let url = window.location.origin + '/#/bindMobile?redirect='+ redirect ;
                  window.location.href = url ;
                }else{
                  this.$vux.toast.show({
                    text : '登录成功',
                    type : 'success',
                    width : '25%'
                  });
                  let redirect = decodeURIComponent( this.$route.query.redirect ) ;
                  if(redirect) {
                    // 避免授权的bug;
                    let temp = window.location.origin + '/#' + redirect ;
                    window.location.href = temp ;
                  }
                  else {
                    // 避免授权的bug;
                    let temp2 = window.location.origin + '/#/home' ;
                    window.location.href = temp2 ;
                  }
                }
              })
              .catch( err => {
                this.$vux.toast.text(err.msg);
              })
          }).catch(err => {
            this.$vux.toast.text('获取地理信息失败');
          });
        }
      }

    },

  }
</script>

<style lang="scss" scoped>
  @import '../../style/mixin' ;
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translateX( 100% );
    opacity: 0;
  }
  .login-wraper{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
  }
  .register a {
    font-size: 0.28rem;
    color: $mainColor ;
  }
  .login-modal {
    padding: 0 0.28rem;
    .login-com {
      display: block;
      @include wh( 100% , 0.9rem );
      @include bb-1px( #e8e8e8 );
      line-height: 0.9rem;
      > span {
        font-size: 0.28rem;
        margin-right: 0.2rem;
        color: #333;
      }
      > input {
        width: 6rem;
        font-size: 0.28rem;
        color: #666;
      }
    }
  }
  .login-submit {
    width: 7rem;
    height: 0.88rem;
    line-height: 0.88rem;
    margin: 0.8rem auto 0;
    border-radius: 0.04rem;
    text-align: center;
    color: #fff;
    font-size: 0.32rem;
    background-color: $mainColor;
  }
  .other-login {
    margin-top: 0.4rem;
    padding: 0 0.28rem;
    a {
      color: $mainColor ;
      font-size: 0.24rem;
    }
  }
  .wx-login-wraper {
    padding: 2rem 0.28rem 0.8rem;
    text-align: center;
    .title {
      font-size: 0.28rem;
      color: #999;
      position: relative;
      &:before {
        content : "";
        position: absolute;
        @include wh( 2.4rem , 1px );
        top: 0.15rem;
        left: 0;
        background-color: #ccc;
      }
      &:after {
        content : "";
        position: absolute;
        @include wh( 2.4rem , 1px );
        top: 0.15rem ;
        right: 0;
        background-color: #ccc;
      }
    }
    .wx-login {
      margin-top: 0.8rem;
      .wx-img {
        @include wh( 0.8rem , 0.8rem );
        margin: 0 auto;
        @include bg-image( '../../images/ic_wechata_two_five' );
      }
      .wx-text {
        margin-top: 0.2rem;
        font-size: 0.24rem;
        color: #999;
      }
    }
  }
</style>
