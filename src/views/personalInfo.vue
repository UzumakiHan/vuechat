<template>
	<div class="myinfo">

		<van-nav-bar :title="userinfo.vuechatName" left-text="返回" left-arrow @click-left="onClickLeft">
			<template #right v-if="userid == userinfo._id">
				<span @click="onClickRight" style="color: #fff;">编辑</span>
				<!-- <van-icon name="search" size="18" @click-right="onClickRight"/> -->
			</template>
		</van-nav-bar>
		<van-row type="flex" justify="center" style="margin-top:10px;margin-bottom:10px;">
			<van-col>
				<van-image round width="100px" height="100px" :src="userinfo.vuechatAvatar" />
			</van-col>
		</van-row>
		<van-cell-group>
			<van-field label="用户账号" :left-icon="accounticon" disabled v-model="userinfo.vuechatAccount" />
			<van-field label="用户名" :left-icon="usericon" disabled v-model="userinfo.vuechatName" />
			<van-field label="性别" :left-icon="sexicon" disabled v-model="userinfo.sex" />
			<van-field label="手机号码" :left-icon="phoneicon" disabled v-model="userinfo.phone" />
			<van-field label="生日" :left-icon="brithdayicon" disabled v-model="userinfo.brithday" />
			<van-field label="地址" :left-icon="addressicon" disabled v-model="userinfo.address" />
			<van-field rows="1" autosize label="个人签名" type="textarea" :placeholder="userinfo.personalSign" :left-icon="signicon"
			 disabled />
		</van-cell-group>
	</div>
</template>
<script>
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
				userinfo: {},
				userid: ""
			};
		},
		computed: {

		},
		mounted() {
			//console.log(this.$store.state.userInfo)
			this.userinfo = JSON.parse(this.$route.query.userinfo);
			this.userid = localStorage.getItem("vuechatid");
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1);
			},
			onClickRight() {
				this.$router.push("/editpersoninfo");
			}
		}
	};
</script>
<style lang="less" scoped>
	.van-field__control:disabled {
		color: #323233;
	}
</style>
