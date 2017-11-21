<template>
	<div class="wallet-children-detail">
		<v-head go-back="true">
	    <div slot="center-part">消费明细</div>
	  </v-head>
		<div class="detail gray">
			<div class="line">
				{{ type }}
			</div>
			<div class="amount line">
				{{ amount }}
			</div>
			<div class="flex">
				<div>订单号</div>
				<div>{{ num }}</div>
			</div>
			<div class="flex">
				<div>付款方式</div>
				<div>余额支付</div>
			</div>
			<div class="flex">
				<div>商品说明</div>
				<div class="ellipsis-box">
					<span>{{ description }}</span>
				</div>
			</div>
			<div class="flex">
				<div>创建时间</div>
				<div>{{ time }}</div>
			</div>
		</div>
	</div>
</template>

<script>
	import vHead from '../../../../components/vHead'
	import { walletPayDetail } from '../../../../service/getData'

	export default {
		data() {
			return {
				id: this.$route.params.id,
				type: '',
				amount: '',
				num: '',
				description: '',
				time: ''
			}
		},
		components: {
			vHead
		},
		mounted() {
	  	this.init();
	  },
		methods: {
			init: function() {
				walletPayDetail(this.id).then(res => {
					if(res.code == 1) {
						let r = res.result;
						if(r.transaction_type == 2) {
							this.type = "成功订单";
							this.amount = r.amount / 100;
						}
						if(r.transaction_type == 3) {
							this.type = "退款金额";
							this.amount = '+ ' + r.amount / 100;
						}

						this.num = r.out_trade_no;
						this.description = r.goods;
						this.time = r.created_at;
					}
				}).catch(err => {
					console.log(err);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../../../style/mixin";

	.wallet-children-detail {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
		background-color: $bgc;
    z-index: 100;
    text-align: center;
    font-size: 0.28rem;

		.line {
			padding: 0.2rem 0
		}

		.flex {
			display: flex;
			align-items: center;
			justify-content: space-between;
			@extend .line
		}

		.gray {
			color: #999
		}

		.amount {
			color: #333;
			font-size: 0.4rem
		}

    .detail {
    	background: $white;
    	padding: 0.2rem 0.3rem
    }

    .ellipsis-box {
    	max-width: 4rem;
    	overflow: hidden;
    	span {
				display: inline-block;
				width:95%;
				overflow: hidden;
  			white-space: nowrap;
  			text-overflow: ellipsis
    	}
    }
	}
</style>
