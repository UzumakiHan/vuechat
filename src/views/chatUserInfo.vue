<template>
	<div>
		<van-nav-bar :title="userinfo.vuechatName" :fixed="true" left-text="返回" left-arrow @click-left="onClickLeft" />
		<div class="user-page">
			<van-image width="60" height="60" :src="userinfo.vuechatAvatar" @click="previewImg(userinfo.vuechatAvatar)" />
			<div class="chat-info">
				<p class="chat-title">
					<span style="margin-right:5px;font-weight:bold;">{{userinfo.vuechatName}}</span>
					<van-icon :name="maleLogo" v-if="this.userinfo.sex == '男'" />
					<van-icon :name="femaleLogo" v-else />
				</p>
				<p class="chat-content">
					<span>vuechat号：</span>
					<span>{{userinfo.vuechatAccount}}</span>
				</p>
				<p class="chat-content">
					<span>地区：</span>
					<span>{{userinfo.address}}</span>
				</p>
			</div>
			<i data-v-15c04174 class="van-icon van-icon-arrow van-cell__right-icon" @click="checkUserInfo(userinfo)">

				<!---->

			</i>
		</div>
		<div class="function-list">
			<div class="wechat-moment" @click="goMyWechatMoment(userinfo)">
				<span>朋友圈</span>
				<div class="recent-moment">
					<van-image v-for="(baseimg,imgIndex) in imgShowList" :key="imgIndex" width="60" height="60" :src="baseimg" style="margin-right:6px;" />

				</div>
				<i data-v-15c04174 class="van-icon van-icon-arrow van-cell__right-icon arrow-icon">
					<!---->
				</i>
			</div>
		</div>
		<!-- <van-button type="primary" size="large" v-if="this.judgeKey && this.userinfo._id!=this.$store.state.userInfo._id " @click="sendMessage">发消息</van-button> -->
		<div class="send-message-div" v-if="this.judgeKey && this.userinfo._id!=this.$store.state.userInfo._id " @click="sendMessage">
			<van-icon name="chat-o" />
			<span>发消息</span>
		</div>
		<!-- <van-button type="info" size="large" v-if="!this.judgeKey && this.userinfo._id!=this.$store.state.userInfo._id" @click="sendApply">添加好友</van-button> -->
		<div class="send-message-div" v-if="!this.judgeKey && this.userinfo._id!=this.$store.state.userInfo._id" @click="sendApply">
			<van-icon :name="addIcon" />
			<span>添加好友</span>
		</div>
		<!-- <van-button type="danger" size="large" v-if="this.judgeKey && this.userinfo._id!=this.$store.state.userInfo._id" @click="delFriend">删除好友</van-button> -->
		<div class="send-message-div" v-if="this.judgeKey && this.userinfo._id!=this.$store.state.userInfo._id" @click="delFriend">
			<van-icon :name="delIcon" />
			<span>删除好友</span>
		</div>
		<div class="send-message-div" v-if="this.judgeKey && this.userinfo._id!=this.$store.state.userInfo._id" @click="cleanMessage">
			<van-icon name="delete-o" />
			<span>删除聊天记录</span>
		</div>
	</div>
</template>
<script>
	import {
		ImagePreview,
		Toast,
		Dialog
	} from "vant";
	import {
		delMyFriend,
		cleanDigtalChatMessage,
		getMyWechatMoments
	} from "../api";
	export default {
		inject: ["reload"], //注入App里的reload方法
		data() {
			return {
				imgData: [],
				maleLogo: require("../assets/images/male.png"),
				femaleLogo: require("../assets/images/female.png"),
				addIcon: require("../assets/images/add-icon.svg"),
				delIcon: require("../assets/images/del-icon.png"),
				userinfo: {},
				userid: "",
				judgeKey: false, //好友判断标志
				imgShowList: [], //展示的朋友圈图片
			};
		},
		mounted() {
			// this.$router.go(0);
			this.userinfo = JSON.parse(this.$route.query.userinfo);
			//console.log(this.userinfo);
			this.socket = this.$socketio.connect("http://127.0.0.1:3000", {
				transports: ["websocket", "xhr-polling", "jsonp-polling"]
			});
			this.getUserInfo();
			this.getImgShowList();
		},
		activated() {},
		methods: {
			previewImg(avatar) {
				console.log(avatar)
				let avatarArr = [];
				avatarArr.push(avatar)
				ImagePreview(avatarArr);
			},
			onClickLeft() {
				this.$router.go(-1);
			},
			//发送好友申请
			sendApply() {
				// console.log(this.userinfo)
				// console.log(this.$store.state.userInfo);
				let vuechatUserInfo = this.$store.state.userInfo
					.myApplyVuechatFriendsList;
				//console.log(vuechatUserInfo);
				if (vuechatUserInfo.length > 0) {
					vuechatUserInfo.forEach(item => {
						if (item == this.userinfo._id) {
							Toast("好友已申请中，切勿重复发起申请。");
						} else {
							let sendApplyData = {
								applyUserInfoId: this.$store.state.userInfo._id,
								recieveUserInfoId: this.userinfo._id
							};
							this.socket.emit("sendApplyMessage", sendApplyData);
							this.socket.on("receiveApplyMessage", msg => {
								if (msg.status === 1) {
									Toast(msg.message);
								} else {
									Toast(msg.message);
									this.getUserInfo();
								}
							});
						}
					});
				} else {
					let sendApplyData = {
						applyUserInfoId: this.$store.state.userInfo._id,
						recieveUserInfoId: this.userinfo._id
					};
					this.socket.emit("sendApplyMessage", sendApplyData);
					this.socket.on("receiveApplyMessage", msg => {
						if (msg.status === 1) {
							Toast(msg.message);
						} else {
							Toast(msg.message);
							this.getUserInfo();
						}
					});
				}
			},
			//获取登录用户信息
			async getUserInfo() {
				this.userid = localStorage.getItem("vuechatid");
				// console.log(this.userid);
				const result = await this.$store.dispatch("getMyInfo", this.userid);
				//console.log(result);
				this.judgeMyFriends();
			},
			//判断当前用户是否为 好友
			judgeMyFriends() {
				let friendsList = this.$store.state.userInfo.friendsList;
				//  console.log(friendsList)
				if (friendsList.length > 0) {
					friendsList.forEach(item => {
						if (item == this.userinfo._id) {
							this.judgeKey = true;
						}
					});
				}
			},
			//删除好友
			async delFriend() {
				let delInfo = {
					delId: this.userinfo._id,
					myId: this.$store.state.userInfo._id
				};
				Dialog.confirm({
						title: "删除联系人",
						message: `将联系人“${this.userinfo.vuechatName}”删除，将同时删除与该联系人的聊天记录`
					})
					.then(async () => {
						// console.log(removeInfo);
						const result = await delMyFriend(delInfo);
						if (result.data.status === 2) {
							Toast(result.data.message);
							this.$router.push('/maillist')
						} else {
							Toast(result.data.message);

						}
						// console.log(result)
						// this.logout();
					})
					.catch(() => {
						this.cleanFlag = false;
						// on cancel
					});

				//this.reload();
				// console.log(result)
			},
			//跳转到发消息的页面
			sendMessage() {
				this.$router.push({
					name: "ChatPage",
					query: {
						userinfo: JSON.stringify(this.userinfo)
					}
				});
			},
			//清除聊天记录
			async cleanMessage() {

				let delId = this.$store.state.userInfo._id + this.userinfo._id
				console.log(delId)
				Dialog.confirm({
						title: "删除聊天记录",
						message: `将联系人“${this.userinfo.vuechatName}”的聊天记录删除`
					})
					.then(async () => {
						// console.log(removeInfo);
						let delId = this.$store.state.userInfo._id + this.userinfo._id
						console.log(delId)
						const result = await cleanDigtalChatMessage(delId);
						if (result.data.status === 2) {
							Toast(result.data.message);
						} else {
							Toast(result.data.message);
						}
					})
					.catch(() => {

						// on cancel
					});

				// console.log(result)
			},
			goMyWechatMoment(userinfo) {
				this.$router.push({
					name: "MyWechatMoments",
					query: {
						userinfo: JSON.stringify(userinfo)
					}
				});
				// this.$router.push('/mywehatmoments')
			},
			//获取imgShowList
			async getImgShowList() {
				const result = await getMyWechatMoments(this.userinfo._id);
				//	console.log(result.data.myWechatMoments[0])
				let userWechatmoment = result.data.myWechatMoments[0]
				if (!userWechatmoment) return;
				let wechatMomentList = userWechatmoment.reverse();
				let imglist = []
				wechatMomentList.forEach(item => {
					item.base64ImgList.forEach(base64Img => {
						imglist.push(base64Img)
					})
				})

				this.imgShowList = imglist.slice(0, 3);
				//console.log(this.imgShowList)
			},
			checkUserInfo(userinfo) {
				//console.log(userinfo)
				this.$router.push({

					name: "PersonalInfo",

					query: {

						userinfo: JSON.stringify(userinfo)

					}

				});
			}
		}
	};
</script>
<style lang="less" scoped>
	.user-page {
		background: #fff;
		margin-top: 46px;
		padding: 10px 8px;
		display: flex;
		align-items: center;

		.chat-info {
			margin-left: 15px;
			//   height:40px;
			flex: 1;

			.chat-title {
				display: flex;
				align-items: center;
				font-size: 15px;
			}

			.chat-content {
				color: #999;
				font-size: 13px;
				margin-top: 6px;
			}
		}
	}

	.function-list {
		background: #fff;
		margin-top: 10px;
		padding: 10px 8px;

		.wechat-moment {
			display: flex;
			align-items: center;
			position: relative;
			// border-bottom: 1px solid #eee;
			margin-bottom: 6px;
			padding: 6px 0;

			span {
				font-size: 16px;
			}

			.recent-moment {
				width: 70%;
				margin-left: 10px;
			}

			.arrow-icon {
				position: absolute;
				right: 0;
			}
		}
	}

	.send-message-div {
		background: #fff;
		margin-top: 10px;
		padding: 10px 8px;
		display: flex;
		align-items: center;
		justify-content: center;

		span {
			font-size: 15px;
			margin-left: 5px;
			color: #3485fb;
		}
	}
</style>
