<template>
	<div>
		<van-nav-bar title="好友申请" :fixed="true" left-text="返回" left-arrow @click-left="onClickLeft" />
		<!-- 好友申请的列表 -->
		<van-tabs v-model="active" style="margin-top:46px;">
			<van-tab title="发出的好友申请">
				<van-empty description="暂未发出好友申请" v-if="this.sendApplyList.length===0" />
				<ul class="search-list" v-else>
					<li class="search-item" v-for="(item,index) in sendApplyList" :key="index">
						<van-image width="60" height="60" :src="item.vuechatAvatar" />
						<div class="userinfo">
							<p>
								<span>vuechat号：</span>
								<span>{{item.vuechatAccount}}</span>
							</p>
							<p>
								<span>vuechat昵称：</span>
								<span>{{item.vuechatName}}</span>
							</p>
						</div>
						<div class="apply-btn">
							<van-button type="info" size="mini">申请中</van-button>
						</div>
					</li>
				</ul>
			</van-tab>
			<van-tab title="收到的好友申请">
				<van-empty description="暂未收到好友申请" v-if="this.recieveApplyList.length===0" />
				<ul class="search-list" v-else>
					<li class="search-item" v-for="(item,index) in recieveApplyList" :key="index">
						<van-image width="60" height="60" :src="item.vuechatAvatar" />
						<div class="userinfo">
							<p>
								<span>vuechat号：</span>
								<span>{{item.vuechatAccount}}</span>
							</p>
							<p>
								<span>vuechat昵称：</span>
								<span>{{item.vuechatName}}</span>
							</p>
						</div>
						<div class="apply-btn">
							<van-button type="info" size="mini" @click="applyVueChat(item)">接受申请</van-button>
						</div>
					</li>
				</ul>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
	import {
		applyVuechatFriends,
		getUserInfo
	} from "../api";
	import {
		Toast
	} from "vant";
	export default {
		inject: ["reload"], //注入App里的reload方法
		data() {
			return {
				active: 0,
				noApply: false,
				hasApply: true,
				userid: "",
				sendApplyList: [], //发出的申请
				recieveApplyList: [] ,//收到的好友申请
				onlineUserList:null
			};
		},
		mounted() {
			this.getUserInfo();
			this.socket = this.$socketio.connect("http://127.0.0.1:3000", {
				transports: ["websocket", "xhr-polling", "jsonp-polling"]
			});

			// this.sendApplyList = this.$store.state.userInfo.myApplyVuechatFriendsList
			//console.log('4444---'+this.$store.state.userInfo)
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1);
			},
			//查找登录用户的信息
			async getUserInfo() {
				this.userid = localStorage.getItem("vuechatid");
				//  console.log(this.userid)
				const result = await this.$store.dispatch("getMyInfo", this.userid);
				let userinfo = this.$store.state.userInfo;
				userinfo.myApplyVuechatFriendsList.forEach(async item => {
					const userInfo = await getUserInfo(item);
					this.sendApplyList.push(userInfo.data.userinfo);
				});
				userinfo.applyVuechatFriendsList.forEach(async item => {
					const userInfo = await getUserInfo(item);
					this.recieveApplyList.push(userInfo.data.userinfo);
				});
			},
			//接受好友的申请
			async applyVueChat(applyinfo) {
				let recieveApplyData = {
					applyUserInfoId: applyinfo._id,
					recieveUserInfoId: this.$store.state.userInfo._id
				};
				//console.log(recieveApplyData);
				this.socket.emit("recieveAddMessage", recieveApplyData);
				this.socket.on("sendMyAddMessage", msg => {
					if (msg.status === 1) {
						Toast(msg.message);
					} else {
						Toast(msg.message);
						
						this.$router.push('/')
					}
					//this.reload();
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	.search-list {
		background: #fff;
		margin-top: 10px;

		.search-item {
			display: flex;
			align-items: center;
			padding: 8px 6px 8px 6px;
			border-bottom: 1px solid #eee;
			position: relative;

			&:last-of-type {
				border: none;
			}

			.userinfo {
				margin-left: 10px;

				span {
					font-size: 15px;
				}
			}

			.apply-btn {
				position: absolute;
				right: 10px;
			}
		}
	}
</style>
