<template lang="html">
  <div class="change-mobile-wrap">
      <v-head go-back="true">
        <div slot="center-part">修改手机号</div>
      </v-head>
      <section v-if="isShow" class="CM-content">
        <div class="CM-top">
          <span class="active"  @click.stop="showCheckOldMobile">1.验证身份</span>
           <i class="ic-center"></i>
           <span>2.验证新手机号</span>
        </div>
        <div class="CM-center">
          <input class="" disabled type="number" v-model='userProfile.mobile' max="6"/>
          <span @click.stop="sendOldCaptcha" :class="oldInterval?'active':''">发送验证码{{oldInterval?'('+oldInterval+'s)':''}}</span>
        </div>

        <div class="CM-bottom">
          <input class="CM-input" type="number" v-model='data.old_mobile_captcha'  placeholder="请输入验证码" max="6"/>
        </div>
      </section>
      <div v-if="isShow" class="save" @click.stop="checkOldMobile">验证</div>
      <section v-if="!isShow"  class="CM-content">
        <div class="CM-top">
          <span  @click.stop="showCheckOldMobile">1.验证身份</span>
           <i class="ic-center"></i>
           <span class="active">2.验证新手机号</span>
        </div>
        <div class="CM-center">
          <input class=""  type="number" v-model='data.new_mobile' placeholder="请输入新手机号"/>
          <span @click.stop="sendNewCaptcha" :class="newInterval?'active':''">发送验证码{{newInterval?'('+newInterval+'s)':''}}</span>
        </div>

        <div class="CM-bottom">
          <input class="CM-input" type="number" v-model='data.new_mobile_captcha'  placeholder="请输入验证码" max="6"/>
        </div>
      </section>
      <div v-if="!isShow" class="save" @click.stop="checkNewMobile">验证</div>
  </div>
</template>

<script>
import vHead from 'src/components/vHead'
import { mapState } from 'vuex'
import { setUserMobile, sendMsg , captchaBoolean} from 'src/service/getData';
import { PASSWORD_REG , INT_SIX_REG, MOBILE_REG} from 'src/config/data';
export default {
  data() {
    return {
      data: {
        old_mobile_captcha: '',
        new_mobile: '',
        new_mobile_captcha: ''
      },
      isShow: true,
      oldInterval: 0,
      newInterval: 0
    }
  },
  components: { vHead },

  computed: {
    ...mapState([
      'userProfile'
    ]),
  },
  created() {
    this.$emit('edit');
  },
  mounted() {

  },
  methods: {
    initData() {

    },
    showCheckOldMobile() {
      this.isShow = true
    },
    showCheckNewMobile() {
      this.isShow = false
    },
    sendOldCaptcha() {
      if (this.oldInterval != 0) {
        return;
      }
      sendMsg({
        account: this.userProfile.mobile,
        usage: 3
      }).then(res => {

          this.oldInterval = 60;
          let timer1 = setInterval(() => {
            this.oldInterval = this.oldInterval - 1;
            if (this.oldInterval == 0) {
              clearInterval(timer1)
            }
          }, 1000)
        })

    },
    checkOldMobile() {
      if (!INT_SIX_REG.test(this.data.old_mobile_captcha)) {
        this.$vux.toast.text('请输入正确的验证码', 'middle');
        return ;
      }
      // 显示
      this.$vux.loading.show({
        text: 'Loading'
      })

      captchaBoolean({
        mobile: this.userProfile.mobile,
        captcha: this.data.old_mobile_captcha
      }).then(res=>{
        // 隐藏
        this.$vux.loading.hide()
        this.$vux.toast.show({
          text: '请验证新手机号',
          type: 'text',
          width: '33%',
          time: 500
        });
        this.showCheckNewMobile()
      }).catch(err=>{
        // 隐藏
        this.$vux.loading.hide()
      })
    },
    sendNewCaptcha() {

      if (this.newInterval != 0) {
        return;
      }
      if (!MOBILE_REG.test(this.data.new_mobile)) {
        this.$vux.toast.text('请输入正确的手机号', 'middle');
        return;
      }
      sendMsg({
        account: this.data.new_mobile,
        usage: 3
      }).then(res => {
         this.newInterval = 60;
          let timer2 = setInterval(() => {
            this.newInterval = this.newInterval - 1;
            if (this.newInterval == 0) {
              clearInterval(timer2)
            }
          }, 1000)
        })

    },
    checkNewMobile() {
      // if (!INT_SIX_REG.test(this.data.old_mobile_captcha)) {
      //   this.$vux.toast.text('请输入正确的验证码', 'middle');
      //   return;
      // }
      if (!MOBILE_REG.test(this.data.new_mobile)) {
        this.$vux.toast.text('请输入正确的手机号', 'middle');
        return;
      }
      if (!INT_SIX_REG.test(this.data.new_mobile_captcha)) {
        this.$vux.toast.text('请输入正确的验证码', 'middle');
        return;
      }
      // 显示
      this.$vux.loading.show({
        text: 'Loading'
      })
      setUserMobile(this.data).then(res => {
        this.$vux.loading.hide()
        this.$emit('edit');
        this.$router.go(-1);
        this.$vux.toast.show({
          text: '成功',
          type: "success",
          time: 500
        })
      }).catch(err => {
        // 隐藏
        this.$vux.loading.hide()
      })

    }
  }

}

</script>
<style lang="scss" scoped>
@import "../../../style/mixin";

@mixin angle($width, $bw, $color, $direction, $right:0) {
  position: relative;
  &::after {
    content: " ";
    display: inline-block;
    height: $width;
    width: $width;
    border: $bw solid $color;
    border-color: $color $color transparent transparent; // -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    // transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: rotate($direction) translateY(-50%);
    position: absolute;
    top: 50%;
    right: $right;
  }
}

.change-mobile-wrap {
  @include allcover;
  z-index: 100;
  background-color: $bgc;
  @include wh(100%, 100%);
}

.change-mobile-wrap {
  .CM-content {
    background: #fff;
    display: flex;
    flex-direction: column;
    .CM-top {
      display: flex;
      align-items: center; // background:#fff;
      @include wh(100%, 0.9rem);
      @include bb-1px(#ddd);
      span {
        flex: 1;
        text-align: center;
        &.active {
          color: $mainColor;
        }
      }
      i.ic-center {
        @include wh(1rem, 100%);
        @include angle(0.10rem, 1px, #888, 45deg, 50%);
      }
    }
    .CM-center {
      margin-left: 0.28rem;
      display: flex;
      align-items: center;
      @include bb-1px(#ddd);
      @include wh(auto, 0.9rem);
      input {
        @include wh(5rem, 100%);
        font-size: 0.28rem;
      }
      span {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        @include wh(auto, 100%);
        @include bl-1px(#ddd);
        &.active {
          opacity: 0.6;
          background: #fafafa;
        }
      }
    }
    .CM-bottom {
      @include bb-1px(#ddd);
      &:last-child {
        @include bb-1px(transparent);
      }
      .CM-input {
        @include wh(100%, 0.9rem);
        padding: 0.15rem 0.24rem;
        background: #fff;
        font-size: 0.26rem;
      }
    }
  }

  .save {
    width: 7rem;
    height: 0.88rem;
    line-height: 0.88rem;
    margin: 0.8rem auto 0;
    border-radius: 0.06rem;
    text-align: center;
    @include sc(0.32rem, #fff);
    background-color: $mainColor;
  }
}
</style>


