<template>
  <div>

    <v-head isFixed="true" goBack="true">
      <div slot="center-part">推送消息</div>
    </v-head>
    <div class="message-list" v-load-more="loadingMore">
      <div class="message-item" v-for="(item,index) in messageList">
        <div class="message-header">
          {{ item.created_at }}
        </div>
        <div class="message-body">
          <div>
            {{ item.title }}
          </div>
          <div>
            {{ item.content }}
          </div>
        </div>
      </div>
      <load-more v-show="is_show" :tip="loadingTip" :show-loading="showLoading" background-color="transparent"></load-more>
    </div>
  </div>
</template>

<script>
	import { LoadMore } from 'vux';
	import { getSession } from '../../config/tools';
	import { loadMore } from '../../components/mixin';
	import { getMessage, badgeMessage} from '../../service/getData';
  import vHead from 'src/components/vHead.vue' ;
	export default {
		data() {
			return {
				id: '',
				messageList: [],
				params: {
					page: 1,
					pageSize: 10
				},
				showLoading: false,
      	loadingTip: '加载中...',
      	end: false,
      	preventRepeatReuqest: false,
      	is_show: false
			}
		},
		mixins: [loadMore],
		components: {
			LoadMore,vHead
		},
		mounted() {
	  	this.init();
	  },
		methods: {
			init() {
				let userInfo = getSession("userInfo");
				if(userInfo) {
					this.id = userInfo.id;
					let msg_ids = [];
					getMessage(this.id,this.params).then(res => {
						if(res.code == 1) {
							this.messageList = res.result.data;
							for(let i = 0;i < this.messageList.length; i++) {
								msg_ids.push(this.messageList[i].id)
							}

							this.badgeRead(msg_ids);
						}
					}).catch(err => {
						console.log(err);
					})
				}
			},
			loadingMore() {
	  		if(this.end) {
	  			return;
	  		}
	  		if (this.preventRepeatReuqest) {
	        return;
	      }
	  		this.showLoading = true;
      	this.preventRepeatReuqest = true;

	      // 正在加载
	      this.is_show = true;
	      this.showLoading = true;

	      this.params.page++;
	      let msg_ids = [];

	      getMessage(this.id,this.params).then(res => {
	      	if(res.code == 1) {
	      		this.messageList = [...this.messageList,...res.result.data];
	      		this.is_show = false;
          	this.showLoading = false;

          	for(let i = 0;i < this.messageList.length; i++) {
								msg_ids.push(this.messageList[i].id)
							}

						this.badgeRead(msg_ids);

          	if (res.result.data.length < this.params.pageSize) {
	            this.end = true;
	            this.is_show = true;
	            this.loadingTip = '没有更多数据了';
          	}
          	this.preventRepeatReuqest = false;
          }

	      })
	  	},
	  	badgeRead(ids) {
	  		if(ids.length > 0) {
	  			let ids_str = ids.join();
	  			badgeMessage(this.id,ids_str).then(res => {

	  			}).catch(err => {
	  				this.$vux.toast.text(err.msg);
	  			})
	  		}
	  	}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../style/mixin";

	.message-list {
		font-size: 0.28rem;

		.message-item {
			padding: 0 0.3rem
		}

		.message-header {
			line-height: 0.8rem;
			text-align: center
		}

		.message-body {
			width: 100%;
			height: 100%;
			background: $white;
			padding: 0.2rem 0.3rem;
			border-radius: 0.16rem;
			div {
				line-height: 0.4rem
			}
		}
	}
</style>
