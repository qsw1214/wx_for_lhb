<template lang="html">
  <div class="register-wraper">
     <v-head go-back="true">
      <div slot="center-part" class="register">注册</div>
    </v-head>
    <form action="javascript:;" class="register-model">
      <label class="register-com border-1px"><span class="add-pre">+86</span><input type="number" placeholder="请输入手机号" autocomplete="off" class="mobile" v-model.trim="account"></label>
      <div class="register-com border-1px">
         <label class="reg-lt">
          <span class="com-left">验证码</span><input type="number" placeholder="请输入验证码" autocomplete="off" class="identifying" v-model.trim="captcha">
        </label>
        <div class="get-identifying" :class="{ active : account }">
          <span v-if="!interval"  @click="getIdentifying">获取验证码</span>
          <span v-else="interval" class="send">已发送( {{ interval }} )</span>
        </div>

      </div>

      <label class="register-com border-1px"><span class="com-left">密码</span><input
                                            type="password"
                                            placeholder="6-30位数字或字母"
                                            class="password"
                                            autocomplete="off"
                                            v-model="password">
      </label>
      <label class="register-com border-1px"><span class="com-left">确认密码</span><input
                                            type="password"
                                            placeholder="请确认密码"
                                            class="confirm-password"
                                            autocomplete="off"
                                            v-model="confirmPassword">
      </label>
      <label class="register-com border-1px"><span class="com-left">邀请码</span><input
                                            type="text"
                                            placeholder="请输入邀请码(选填)"
                                            class="invite-code"
                                            autocomplete="off"
                                            v-model="invite_code">
      </label>
    </form>
    <div class="register-submit" :class="{ disabled : !is_agree }" @click="postRegister">
      注册
    </div>
    <div class="agreement">
      <input type="checkbox" v-model="is_agree">
      <span>我已阅读并同意<a href="https://m.linhuiba.com/protocal.html">《邻汇吧用户注册协议》</a></span>
    </div>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead' ;
  import { CAPTCHA_REG , MOBILE_REG , INT_SIX_REG , PASSWORD_REG } from 'src/config/data' ;
  import { sendMsg , captchaBoolean , register } from 'src/service/getData' ;
export default {
  data (){
    return {
      account : '',
      password : '',
      confirmPassword : '' ,
      captcha : '' ,
      invite_code : '',
      interval : 0 ,
      is_agree : true
    }
  },
  components : {
    vHead
  },
  methods : {
    getIdentifying () {
      // 对电话号码做判断

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
    postRegister () {
      if( this.is_agree ){
        if( !MOBILE_REG.test( this.account ) ){
          this.$vux.toast.text('请输入11位有效手机号', 'middle') ;
          return ;
        }
        if( !INT_SIX_REG.test( this.captcha ) ){
          this.$vux.toast.text('请输入4-6位有效的数字验证码', 'middle') ;
          return ;
        }
        if( !PASSWORD_REG.test( this.password ) ){
          this.$vux.toast.text('请输入6-30位数字字母组成的密码', 'middle') ;
          return ;
        }
        if( this.password != this.confirmPassword ){
          this.$vux.toast.text('你两次输入的密码不一致,请重新输入', 'middle') ;
          return ;
        }
        if( this.invite_code ){
          if( !CAPTCHA_REG.test( this.invite_code ) ){
            this.$vux.toast.text('你输入的邀请码有误,请重新输入', 'middle') ;
            return ;
          }
        }

        let mobile = this.account ;
        let captcha = this.captcha ;
        captchaBoolean( { mobile  , captcha  } )
          .then( res => {
            // 验证码有效
            let params = {
              account : this.account ,
              password : this.password ,
              captcha : this.captcha ,
              channel : 'wap'
            };
            if( this.invite_code ){
              params.invite_code = this.invite_code ;
            }
            register( params )
              .then( res => {
                this.$vux.toast.show({
                  text : '恭喜你，注册成功！' ,
                  type : 'success' ,
                  width : '33%'
                });
                // 返回首页
                this.$router.push( '/home' ) ;
              })
              .catch( err => {
                this.$vux.toast.show({
                  text : err.msg ,
                  type : 'cancel' ,
                  width : '33%'
                })
              })
          })
          .catch( err => {
            this.$vux.toast.show({
              text : err.msg ,
              width : '33%' ,
              type : 'warn'
            }) ;
          })
      }


    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .register-wraper{
    padding-bottom: 0.5rem;
    background-color: #fff;
  }
  .register-model {
    padding: 0 0.28rem;
    font-size: 0.28rem;
    line-height: 0.9rem;
    input {
      color : #666 ;
      font-size: 0.28rem;
    }
    .register-com {
      display: flex;
      @include bb-1px( #e8e8e8 );
      position: relative;
    }
    .add-pre {
      width:  1rem ;
      line-height: 0.9rem;
      color: $mainColor;
      @include br-1px( #e8e8e8 );
    }
    .mobile {
      width: 5.7rem;
      height: 0.9rem;
      padding-left: 0.32rem;
    }
    .confirm-password , .password , .invite-code{
      width: 5.3rem;
    }
    .com-left {
      display: inline-block;
      width: 1.34rem;
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
  .register-submit {
    width: 7rem;
    height: 0.88rem;
    line-height: 0.88rem;
    margin: 0.77rem auto 0;
    border-radius: 0.04rem;
    text-align: center;
    color: #fff;
    font-size: 0.32rem;
    background-color: $mainColor;
    &.disabled {
      background-color: #ccc;
    }
  }
  .agreement {
    display: flex;
    align-items: center;
    padding: 0 0.28rem;
    margin-top: 0.4rem;
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.24rem;
    input{
      @include wh(0.32rem,0.32rem);
      margin-right: 0.2rem;
      @include bg-image('../../images/ic_unselected_two_six');
      &:checked{
        @include bg-image('../../images/ic_selected');
      }
    }
    > span {
      color: #666;
      > a {
        color: $mainColor ;
      }
    }
  }
</style>
