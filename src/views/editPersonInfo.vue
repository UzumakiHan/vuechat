<template>
	<div class="myinfo">
		<van-nav-bar title="编辑资料" left-text="返回主页" left-arrow @click-left="onClickLeft" right-text="完成" @click-right="editInfo" />
		<van-row type="flex" justify="center" style="margin-top:10px;">
			<van-col>
				<!-- <van-uploader :after-read="afterRead" v-model="fileList" :max-count="1" v-if="false"/> -->
				<van-image round width="100px" height="100px" :src="userinfo.vuechatAvatar" />
			</van-col>

		</van-row>
		<van-row type="flex" justify="center" style="margin-bottom: 10px;">
			<van-uploader :after-read="afterRead" :max-count="1">
				<van-button icon="photo-o" type="info" size="mini">更改头像</van-button>
			</van-uploader>
		</van-row>
		<van-cell-group>
			<van-field label="用户账号" :left-icon="accounticon" disabled v-model="userinfo.vuechatAccount" />
			<van-field label="用户名" :left-icon="usericon" v-model="userinfo.vuechatName" />
			<van-field label="性别" :left-icon="sexicon" v-model="userinfo.sex" />
			<van-field label="手机号码" :left-icon="phoneicon" v-model="userinfo.phone" />
			<van-field label="生日" :left-icon="brithdayicon" v-model="userinfo.brithday" />
			<van-field label="地址" :left-icon="addressicon" v-model="userinfo.address" />
			<van-field rows="2" autosize label="个人签名" type="textarea" v-model="userinfo.personalSign" :left-icon="signicon" />
		</van-cell-group>
	</div>
</template>
<script>
	import axios from 'axios'
	import {
		Toast,
		ImagePreview
	} from "vant";
	export default {
		name: "myinfo",
		data() {
			return {
				sexicon: require("../assets/images/sex.png"),
				accounticon: require("../assets/images/account.png"),
				usericon: require("../assets/images/user.png"),
				phoneicon: require("../assets/images/phone.png"),
				brithdayicon: require("../assets/images/brithday.png"),
				addressicon: require("../assets/images/address.png"),
				signicon: require("../assets/images/sign.png"),
				userinfo: {
					vuechatAvatar: this.$store.state.userInfo.vuechatAvatar,
					vuechatAccount: this.$store.state.userInfo.vuechatAccount,
					vuechatName: this.$store.state.userInfo.vuechatName,
					sex: this.$store.state.userInfo.sex,
					phone: this.$store.state.userInfo.phone,
					brithday: this.$store.state.userInfo.brithday,
					address: this.$store.state.userInfo.address,
					personalSign: this.$store.state.userInfo.personalSign,
				},
				// fileList: [{
				// 	url: this.$store.state.userInfo.vuechatAvatar
				// }, ],
				base64Avatar: '',
				userid: "",
				imgurl: ""
			};
		},
		computed: {

		},
		mounted() {
			this.userid = localStorage.getItem("vuechatid");

			//console.log(this.$store.state.userInfo.vuechatAvatar)


		},
		methods: {
			onClickLeft() {
				this.$router.push('/my')
			},
			afterRead(file) {
				this.base64Avatar = file.content;
				this.userinfo.vuechatAvatar = file.content


			},
			editInfo() {
				//console.log(this.fileList)
				const formData = new FormData();
				if (this.base64Avatar) {
					formData.append('vuechatAvatar', this.base64Avatar);
				} else {
					formData.append('vuechatAvatar', this.userinfo.vuechatAvatar);
				}
				formData.append('vuechatName', this.userinfo.vuechatName);
				formData.append('sex', this.userinfo.sex);
				formData.append('phone', this.userinfo.phone);
				formData.append('brithday', this.userinfo.brithday);
				formData.append('address', this.userinfo.address);
				formData.append('personalSign', this.userinfo.personalSign);
				formData.append('userid', this.$store.state.userInfo._id);
				let headers = {
					headers: {
						"Content-Type": "multipart/form-data"
					}
				};
				axios.post("/api/user/editVueChatInfo", formData, headers).then(res => {
					//console.log(res)
					if (res.data.status === 2) {
						Toast(res.data.message);
						this.$store.dispatch("getMyInfo", this.userid);
					} else {
						Toast(res.data.message);

					}
				}).catch(err => {
					console.log(err)
				})
			},

		}
	};
</script>
<style lang="less" scoped>
	.van-field__control:disabled {
		color: #323233;
	}
</style>
