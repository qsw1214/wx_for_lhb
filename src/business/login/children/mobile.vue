<template lang="html">
<div class="mobile-login-wraper">
   <v-head go-back="true">
      <div slot="center-part">快速登录</div>
      <div slot="right-part" class="rt register">
        <router-link to="/register" tag="a">注册</router-link>
      </div>
    </v-head>
    <form action="javascript:;" class="login-modal">
      <label class="login-mobile border-1px"><span class="com-text">手机号</span><input type="number" placeholder="请输入手机号" autocomplete="off" class="mobile" v-model.trim="account"></label>
      <div class="clear login-identifying border-1px">
         <label class="left">
          <span class="com-text">验证码</span><input type="number" placeholder="请输入验证码" autocomplete="off" class="identifying" v-model.trim="captcha">

        </label>
        <div class="get-identifying right" :class="{ active : account }">
          <span v-if="!interval"  @click="getIdentifying">获取验证码</span>
          <span v-else="interval" class="send">已发送( {{ interval }} )</span>
        </div>
      </div>

    </form>
     <div class="login-submit" @click="login">
      登录
    </div>
</div>
</template>

<script>
  import vHead from 'src/components/vHead' ;
  import { MOBILE_REG , INT_SIX_REG } from 'src/config/data' ;
  import { sendMsg , captchaBoolean , fastLogin } from 'src/service/getData' ;
  import { mapState , mapMutations } from 'vuex' ;
export default {
    data () {
        return {
          account : '' ,
          captcha : '',
          interval : 0
        }
    },
    components : {
        vHead
    },

    methods : {
      ...mapMutations([
          'RECORD_USERINFO'
      ]),
      getIdentifying () {
        // 对电话号码做判断
        console.log(typeof this.account );
        if( !MOBILE_REG.test( this.account ) ){
          this.$vux.toast.text('请输入11位有效手机号', 'middle') ;
          return ;
        }
        let dataMobile = this.account ;
        sendMsg( { account : dataMobile , usage : 2 } )
          .then( res => {
            this.$vux.toast.text('验证码发送成功' , 'middle');

            this.interval = 60 ;
            this.timer = setInterval( () => {
                this.interval -- ;
                if( this.interval == 0 ){
                    clearInterval( this.timer ) ;
                }
            }, 1000 );
          })
          .catch ( err => {
            this.$vux.toast.text( err.msg , 'middle') ;
          });
      },
      login () {
        if( !MOBILE_REG.test( this.account ) ){
          this.$vux.toast.text('请输入11位有效手机号', 'middle') ;
          return ;
        }
        if( !INT_SIX_REG.test( this.captcha ) ){
          this.$vux.toast.text('请输入4-6位有效的数字验证码', 'middle') ;
          return ;
        }
        let mobile = this.account ;
        let captcha = this.captcha ;
        captchaBoolean( { mobile  , captcha  } )
          .then( res => {
              // 验证码有效
            let account = this.account ;
            let captcha = this.captcha ;
            fastLogin( { account , captcha , channel : 'wap' } )
              .then( res => {
                this.RECORD_USERINFO( res.result );
                if(!res.result.mobile) {
                  // 跳转到绑定手机号页面
                  this.$router.replace({ path : '/bindMobile' , query : {redirect : this.$route.query.redirect } });
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
                this.$vux.toast.show({
                  text : err.msg ,
                  type : 'warn',
                  width : '25%'
                });
              });
          })
          .catch( err => {
            this.$vux.toast.show({
              text : err.msg ,
              width : '33%' ,
              type : 'warn'
            }) ;
            return ;
          })
      }

    }
}

</script>

<style lang="scss" scoped>
  @import "../../../style/mixin";
  .mobile-login-wraper {
    @include allcover ;
    z-index: 100;
    background-color: $white;
  }
  .register a{
    font-size: 0.28rem ;
    color: $mainColor ;
  }
  .login-modal {
    padding: 0 0.28rem;
    font-size: 0.28rem;
    .login-mobile ,.login-identifying {
      display: block;
      @include wh( 100% , 0.9rem );
      line-height: 0.9rem;
      @include bb-1px( #e8e8e8 );
    }
    .com-text {
      margin-right: 0.2rem;
    }
    .mobile {
      width: 5.8rem;
      font-size: 0.28rem;
    }
    .identifying {
      width: 3.9rem;
      font-size: 0.28rem;
    }
    .get-identifying {
      width: 1.8rem;
      text-align: center;
      position: relative;
      > span {
        display: block;
        color: #ccc;
      }
      &:before {
        content: "" ;
        position: absolute;
        top: 0;
        left: 0;
        @include wh( 0.01rem , 0.9rem );
        background-color: #e8e8e8;
      }
      &.active span {
        color: $mainColor ;
      }
      span.send {
        color: #ccc;
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

</style>
