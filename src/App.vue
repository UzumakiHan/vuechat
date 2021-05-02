<template>
	<div id="app">
		<!-- <router-view v-if="isRouterAlive" /> -->
		<router-view v-if="!$route.meta.keepAlive && isRouterAlive" />
		    <keep-alive>
		      <router-view v-if="$route.meta.keepAlive && isRouterAlive" />
		    </keep-alive>
		<van-tabbar v-model="active" v-show="$route.meta.showTabBar" route>
			<van-tabbar-item icon="home-o" to="/" replace>首页</van-tabbar-item>
			<van-tabbar-item icon="friends-o" to="/maillist" replace>通讯录</van-tabbar-item>
			<van-tabbar-item icon="browsing-history-o" to="/wechatmoments" replace>朋友圈</van-tabbar-item>
			<van-tabbar-item icon="user-o" to="/my" replace>我的</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
	import {
		mapState
	} from "vuex";
	import {
		Notify
	} from "vant";
	export default {
		provide() {
			//父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
			return {
				reload: this.reload
			};
		},
		data() {
			return {
				active: 0,
				addIcon: require("./assets/images/add-icon.png"),
				isRouterAlive: true,
				userid: ""
			};
		},
		mounted() {
			this.userid = localStorage.getItem("vuechatid");
			if(this.userid){
				this.getUserInfo()
			}
			this.socket = this.$socketio.connect("http://127.0.0.1:3000", {
				transports: ["websocket", "xhr-polling", "jsonp-polling"]
			});
			//显示是谁发来的消息）
			this.socket.on("receiveChatMessage", msg => {
				//console.log(msg)
				if(this.userid){
					if (msg) {
						if (msg.targetAccountId == this.$store.state.userInfo._id) {
							Notify(`${msg.sendAccountName}发来消息`)
							// this.getUserInfo();
						}
					}
				}
				
			});
			this.socket.on("receiveOffLineChatMessage", msg => {
				//console.log(msg)
				if(this.userid){
					if (msg) {
						if (msg.targetAccountId == this.$store.state.userInfo._id) {
							// Notify('111')
							Notify(`${msg.sendAccountName}发来消息`)
							// this.getUserInfo();
					
						}
					}
				}

			});
			this.socket.on("receiveGrounpChatMessage", msg => {
				//console.log(msg)
				if(this.userid){
					if (msg) {
						let isMyChatRoom = this.$store.state.userInfo.chatRooms.findIndex(
							chatRoomId => chatRoomId == msg.chatRoomId
						);
						if(isMyChatRoom !== -1){
							if (msg.sendAccountId != this.$store.state.userInfo._id) {
								// Notify('111')
								Notify(`${msg.chatRoomName}发来消息`)
								// this.getUserInfo();
												
							}
						}
					}
				}
			
			});


		},
		methods: {
			reload() {
				this.isRouterAlive = false; //先关闭，
				this.$nextTick(function() {
					this.isRouterAlive = true; //再打开
				});
			},
			async getUserInfo(){
				 await this.$store.dispatch("getMyInfo", this.userid);
				
			}
		}
	};
</script>
<style lang="less">
	// html,
	// body,
	// #app {
	// 	height:100%;
		
	// }
	// html{
	// 	background-color: #fff !important;
	// }
	.van-nav-bar__content {
		background-color: #1989fa;

		.van-nav-bar__title {
			color: #fff;
		}
	}

	.van-nav-bar .van-icon {
		color: #fff !important;
	}

	.van-nav-bar__text {
		color: #fff !important;
	}

	.van-field__body {
		width: 100%;
	}
	.van-popover__action{
		width: 20px !important;
		justify-content:center !important;
		// padding: 10px 15px !important;
		padding: 0 20px !important;
	}
	.van-popover--dark .van-popover__content{
		display: flex !important; 
	}
	
</style>
