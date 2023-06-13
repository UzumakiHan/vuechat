<template>
	<div class="my">
		<van-nav-bar title="我的" />
		<van-row type="flex" style="
        padding: 0.26667rem 0.42667rem;
        align-items: center;
        background: #fff;
      ">
			<van-image width="60" height="60" :src="$store.state.userInfo.vuechatAvatar" />
			<div class="chat-info">
				<p class="chat-title">
					<span>
						{{$store.state.userInfo.vuechatName}}
					</span>
					<van-icon :name="maleLogo" v-if="$store.state.userInfo.sex == '男'" />
					<van-icon :name="femaleLogo" v-else />
				</p>
				<p class="chat-content">
					<span>vuechat号：</span>
					<span>{{ $store.state.userInfo.vuechatAccount }}</span>
				</p>
				<p class="chat-content">
					<span>地区：</span>
					<span>{{ $store.state.userInfo.address }}</span>
				</p>
			</div>
			<i data-v-15c04174 class="van-icon van-icon-arrow van-cell__right-icon" @click="goPersonalInfo($store.state.userInfo)">
				<!---->
			</i>
		</van-row>

		<van-cell-group style="margin-top: 10px">
			<van-cell value is-link to="applyfriends">
				<!-- 使用 title 插槽来自定义标题 -->
				<template #title>
					<van-icon :name="chatgroupPng" style="margin-right:4px" size="16" />
					<span class="custom-title">新的朋友</span>
					<van-badge :content="sendApplyNum" style="margin-left:6px" v-if="sendApplyNum>0" />
				</template>
			</van-cell>
			<van-cell :icon="chatgroupPng" title="我的群组" is-link to="mychatgrounp"/>
			<van-cell :icon="applicationPng" title="我的应用" is-link to="application"/>
			<van-cell :icon="changePwdPng" title="更改密码" is-link to="changepassword" />
			<van-cell :icon="logoutPng" title="退出登录" is-link @click="openDialog" />
		</van-cell-group>

	</div>
</template>
<script>
	import {
		mapState
	} from "vuex";
	import Vue from "vue";
	import {
		Toast,
		Notify,
		Dialog
	} from "vant";
	// const emojData = require("@/assets/emojis.json");
	//import { Dialog } from "vant";
	//Vue.use(Toast);
	Vue.use(Toast, Dialog, Notify);
	export default {
		name: "my",
		data() {
			return {
				user_id: "",
				maleLogo: require("../assets/images/male.png"),
				femaleLogo: require("../assets/images/female.png"),
				logoutPng: require("../assets/images/logout.png"),
				chatgroupPng: require("../assets/images/chatgroup.png"),
				applicationPng: require("../assets/images/application.png"),
				changePwdPng: require("../assets/images/changePwd.png"),
				userid: "",
				sendApplyNum: 0
			};
		},
		mounted() {
			//console.log(this.$store.state.userInfo.applyVuechatFriendsList)
			if(this.$store.state.userInfo.applyVuechatFriendsList){
				this.sendApplyNum = this.$store.state.userInfo.applyVuechatFriendsList.length;
			}
			
			//console.log(this.$store.state.userInfo)
			this.socket = this.$socketio.connect(this.$socketHost, {
				transports: ["websocket", "xhr-polling", "jsonp-polling"]
			});

		},
		computed: {},
		methods: {
			//退出登录
			logout() {
				localStorage.removeItem("vuechatid");
				localStorage.removeItem("vuechattoken");
				this.$router.push("/login");
			},
			//打开退出登录的对话框
			openDialog() {
				Dialog.confirm({
						message: "确定退出登录吗？"
					})
					.then(() => {
						this.logout();
					})
					.catch(() => {
						// on cancel
					});
			},
			//去好友申请的页面
			goToApplyFriends() {
				this.$router.push("/applyfriends");
			},
			//去个人资料页面
			goPersonalInfo(userinfo) {

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
	.van-cell__title {
		display: flex;
		align-items: center;
	}

	.chat-info {
		margin-left: 15px;
		// height:40px;
		flex: 1;

		.chat-title {
			font-size: 15px;
			display: flex;
			align-items: center;
		}

		.chat-content {
			color: #999;
			font-size: 13px;
			margin-top: 6px;
		}
	}
</style>
