<template>
	<div class="profile">
		<router-link class="header-content" :to="userInfo ? '/userProfile' : '/login'">
			<router-link class="message" :to="userInfo ? '/message' : '/login'">
				<span :class="{ dot: unreadMessage }"></span>
				<img class="message-img" src="../../images/ic_news_two_four_one@2x.png">
			</router-link>
			<div class="flex-box">
				<div class="flex-box">
				<div class="img-box">
					<img class="avatar-img" v-if="userInfo&&userInfo.avatar" v-lazy="userInfo.avatar">
					<img class="avatar-img" src="../../images/ic_portrait.png" v-else>
          <span class="level-icon" :class="{ v1 : level_id == 1 , v2 : level_id == 2 ,v3 : level_id == 3,v4 : level_id == 4,v5 : level_id == 5 }"></span>
				</div>
				<div class="user-info">
					<div v-if="userInfo" class="info-content">
						<div>
							{{ name }}
						</div>
						<div class="subhead">
							<!-- 隐藏加入企业相关功能部分 -->
							<!-- <span v-if="userInfo&&userInfo.enterprise_authorize_status == 1">
								<img src="">
								<span>已认证</span>
								<span class="vertical-line">|</span>
							</span> -->
							<span>积分值：{{ integral }}</span>
						</div>
					</div>
					<span v-else>
						未登录
					</span>
				</div>
				</div>
				<div class="arrow-box">
				<span class="arrow-text">个人信息</span>
				<span class="white-arrow"></span>
				</div>
			</div>
		</router-link>
    <tips v-if="showInfo">
      <div slot="text">个人资料，有助于订单审核通过</div>
      <router-link to="/userProfile" slot="link" class="go-user-info">完善</router-link>
    </tips>
		<div class="table-view">
			<router-link class="cell has-divider" to="/myorder">
				 <div>
           <span class="img-style order"></span>
				 	<span class="img-text">订单管理</span>
				 </div>
				 <div class="arrow-box">
				 	<span class="gray-arrow"></span>
				 </div>
			</router-link>
			<router-link class="cell" to="/mydemand">
				<div>
          <span class="img-style appeal"></span>
				 	我的需求
				 </div>
				 <div class="arrow-box">
				 	<span class="gray-arrow"></span>
				 </div>
			</router-link>
		</div>

		<div class="table-view">
      <router-link class="cell has-divider" to="/care">
        <div>
          <span class="img-style care"></span>
          <span class="img-text">我的关注</span>
        </div>
        <div class="arrow-box">
          <span class="gray-arrow"></span>
        </div>
      </router-link>
			<div class="cell" v-model="openWallet" @click="onClick">
				<div>
          <span class="img-style wallet"></span>
					<span class="img-text">我的钱包</span>
				</div>
				<div class="arrow-box">
				 	<span class="gray-arrow"></span>
				 </div>
			</div>
		</div>

		<div class="table-view">
			<router-link class="cell has-divider" to="/address">
				<div>
          <span class="img-style contract"></span>
					<span class="img-text">联系人管理</span>
				</div>
				<div class="arrow-box">
				 	<span class="gray-arrow"></span>
				 </div>
			</router-link>
			<router-link class="cell has-divider" to="/myInvoice">
				<div>
          <span class="img-style invoice"></span>
					<span class="img-text">票据管理</span>
				</div>
				<div class="arrow-box">
				 	<span class="gray-arrow"></span>
				</div>
			</router-link>
		</div>

		<div class="table-view">
      <div  class="cell has-divider" @click="showServer">
        <div>
          <span class="img-style link-server"></span>
          <span class="img-text">联系客服</span>
        </div>
        <div class="arrow-box">
          <span class="gray-arrow"></span>
        </div>
      </div>
			<router-link  class="cell"  :to="{ name: 'help'}">
				<div>
          <span class="img-style help"></span>
					<span class="img-text">帮助中心</span>
				</div>
				<div class="arrow-box">
				 	<span class="gray-arrow"></span>
				 </div>
			</router-link>
		</div>

		<v-footer :fourselected="true"></v-footer>

		<div v-transfer-dom>
			<x-dialog  v-model="openWallet" class="model">
				<div>
					<img src="../../images/ic_blue_logo_three@2x.png" class="model-logo">
					<div class="model-info">
						预订场地时，可使用钱包中余额支付，是否开通钱包？
					</div>
					<div class="model-divider"></div>
					<div class="model-dialog flex-box">
						<div class="border-right" @click="cancelModel" style="flex:1">
							以后再说
						</div>
						<div style="flex:1">
							<div class="primary-color" @click="submitModel">开通钱包</div>
						</div>
					</div>
				</div>
			</x-dialog>
		</div>
	</div>
</template>

<script>
	import { Toast, XDialog, TransferDomDirective as TransferDom} from 'vux'
	import { getSession, setSession } from 'src/config/tools'
	import { userInfo, walletInfo, getBadge , getUserStatus } from '../../service/getData'
	import vFooter from '../../components/vFooter'
  import tips from 'src/components/tips' ;
	export default {
		directives: {
    	TransferDom
  	},
		components: {
			Toast,
			XDialog,
			vFooter,tips
		},
		data() {
			return {
				name: '',
				integral: '',
				unreadMessage: false,
				openWallet: false ,
        level_id : 0 ,
        showInfo : false , // 完善弹窗
				userInfo: getSession("userInfo")
			}
		},
		mounted() {
			this.init();
      _MEIQIA('init');
      getUserStatus().then( res => {
        let status = res.result.complete_status ;
        if( !status ){
          this.showInfo = true ;
        }else{
          this.showInfo = false ;
        }
      })
		},
		methods: {
      init() {
      	if(this.userInfo) {
      		userInfo().then (res => {
	      		let user = res.result;
	      		this.level_id = user.membership_level_id ;
	      		this.integral = res.result.consumption_point;
	      		if(user.enterprise_authorize_status == 1) {
	      			if(user.company) {
	      				this.name = user.company;
	      			}
	      			else {
	      				this.name = user.mobile;
	      			}
	      		}
	      		else {
	      			if(user.mobile) {
	      				this.name = user.mobile;
	      			}
	      			else if(user.username) {
	      				this.name = user.username;
	      			}
	      			else {
	      				this.name = user.name;
	      			}
	      		}
      		});
      		getBadge().then(res => {
      			if(res.code == 1) {
      				if(res.result.unread_count > 0) {
      					this.unreadMessage = true;
      				}
      			}
      		});
      	}
      },
      onClick() {
      	if(this.userInfo) {
      		walletInfo().then(res => {
      			if(res.code == 1) {
      				this.$router.push( '/wallet' );
      			}
      		}).catch(err => {
      			if(err.code == -2) {
      				this.openWallet = true;
      			}
      		})
      	}
      	else {
      		this.$router.push( '/login' );
      	}
      },
      cancelModel() {
      	if(this.userInfo) {
      		this.openWallet = false;
      	}
      },
      submitModel() {
      	setSession("setWalletPassword",true);
	  		this.$router.push('/wallet/walletPassword');
      },
      showServer(){
        _MEIQIA('showPanel');
      }
		}
	}
</script>

<style lang="scss">
	@import "../../style/mixin";

	// 弹出框样式的重置
	.flex-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.model .weui-dialog {
		width: 90%;
		max-width: 90%;
		height: auto;
		border-radius: 0.3rem;
		padding: 0.3rem;
		overflow: visible;
		font-size: 0.28rem
	}

	.model-logo {
		position: absolute;
		left: 50%;
		margin-left: -0.8rem;
		top: -0.8rem;
		width: 1.6rem;
		height: 1.6rem
	}

	.border-right {
		border-right: 1px solid #ddd
	}

	.primary-color {
		color: $mainColor
	}

	.model-info {
		margin-top: 1rem;
		line-height: 0.5rem;
		text-align: left
	}

	.model-divider {
		margin-top: 0.3rem;
		margin-bottom: 0.3rem;
		border-top: 1px solid #ddd
	}

	.model-dialog  {
		line-height: 0.5rem
	}

</style>

<style lang="scss" scoped>
	@import "../../style/mixin";
	 /*iphone6下1rem等于50px*/
	/*
  	向右的箭头的混合宏
	*/
  .go-user-info{
    display: block;
    border: 1px solid $mainColor;
    border-radius: 0.04rem;
    color: $mainColor;
  }
	.profile{
    margin-bottom: 1.2rem;
    background-color: $bgc;
		.header-content {
		  display: block;
		  width: 100%;
		  height: auto;
		  color: #FFFFFF;
		  padding: 0.4rem 0.3rem;
		  @include bg-image('../../images/personal penter_bg_three');
		}

		@mixin arrow-right($size,$thickness,$color,$distance) {
		  content: "";
		  position: absolute;
		  width: $size;
		  height: $size;
		  border-style:  solid ;
      border-color: $color;
		  border-width: 0 $thickness $thickness 0;
		  -webkit-transform: rotate(315deg);
		          transform: rotate(315deg);
		  right: $distance
		}

		@mixin arrow-text($size,$color,$distance) {
		  position: absolute;
		  width: 1rem;
		  font-size: $size;
		  color: $color;
		  right: $distance
		}
    .img-box{
      position: relative;
      .level-icon{
        position: absolute;
        bottom: -0.1rem;
        right: 0.1rem;
        @include wh( 0.44rem , 0.36rem );
        @include bg-image('../../images/ic_memberv1 copy_three');
        &.v1 {
          @include bg-image('../../images/ic_memberv1');
        }

        &.v2{
          @include bg-image('../../images/ic_memberv2');
        }
        &.v3{
          @include bg-image('../../images/ic_memberv3');
        }
        &.v4{
          @include bg-image('../../images/ic_memberv4');
        }
        &.v5{
          @include bg-image('../../images/ic_memberv5');
        }
      }
      .avatar-img {
        @include wh(1.2rem,1.2rem);
        border-radius: 50%
      }
    }


		.message {
			display: block;
			position: relative;
			width: 100%;
			height: 0.6rem;
			text-align: right;

			.dot {
				position: absolute;
				right: 0;
				top: 0;
				width: 0.15rem;
				height: 0.15rem;
				border-radius: 50%;
				background: #f56565;
				z-index: 2
			}

			.message-img {
				position: absolute;
				right: 0.05rem;
				top: 0rem;
				z-index: 1;
				width: 0.4rem;
				height: 0.4rem
			}
		}

		.table-view {
			background: $white;
			@include sc(0.28rem,#333);
			margin-top: 0.2rem;
			padding: 0 0.3rem;
			.cell {
				@extend .flex-box;
				padding: 0.3rem -0.3rem;
				height: 0.8rem
			}
			.has-divider {
				border-bottom: 1px solid #ddd
			}
		}

		.vertical-line {
			color: #ddd;
			padding-right: 0.2rem;
			padding-left: 0.2rem
		}

		.flex-box {
			display: flex;
			align-items: center;
			justify-content: space-between
		}

		.user-info {
			@include sc(0.28rem,#fff);
			margin-left: 0.4rem;
			div {
				color: $white
			}
			.info-content {
				width: 3.8rem;
				max-width: 4rem;
				overflow: hidden;
				div {
					width: 95%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap
				}
				.subhead {
					margin-top: 0.2rem;
					font-size: 0.24rem
				}
			}
			span {
				@include sc(0.28rem,#fff)
			}
		}

		.arrow-box {
		 	position: relative;
		 	color: $white;
		 	.white-arrow {
		 		@include arrow-right(0.24rem,1px,#fff,0.14rem);
		 		top: -0.1rem
		 	}
		 	.gray-arrow {
		 		@include arrow-right(0.2rem,1px,#666,0.14rem);
		 		top: -0.1rem
		 	}
		 	.arrow-text {
		 		@include arrow-text(0.24rem,#fff,0.42rem);
		 		top: -0.1rem
		 	}
		}

		.img-style {
			display: inline-block;
			vertical-align: middle;
			width: 0.44rem;
			height: 0.44rem;
      margin-right: 0.1rem;
      &.link-server{
        @include bg-image('../../images/ic_ service_normal_three');
      }
      &.help{
        @include bg-image('../../images/ic_help_center_three');
      }
      &.order{
        @include bg-image('../../images/ic_order_managert_three');
      }
      &.invoice{
        @include bg-image('../../images/ic_invoice_content_three');
      }
      &.contract{
        @include bg-image('../../images/ic_contact_managert_three');
      }
      &.appeal{
        @include bg-image('../../images/ic_demand_three');
      }
      &.care{
        @include bg-image('../../images/ic_my_attention_pressed_three');
      }
      &.wallet{
        @include bg-image('../../images/ic_wallet_three');
      }
		}

		.img-text {
			vertical-align: middle
		}
	}

</style>
