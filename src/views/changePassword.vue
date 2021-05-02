<template>
	<div>
		<van-nav-bar title="更改密码" left-text="返回" left-arrow @click-left="onClickLeft" />
		<van-steps :active="active">
			<van-step>输入原来的密码</van-step>
			<van-step>输入更改的密码</van-step>
			<van-step>确定密码</van-step>
		</van-steps>
		<div class="inputs-div" style="margin-top: 20px;">
			<van-field v-model="originPwd" placeholder="请输入原来的密码" v-if="active === 0" type="password" />
			<van-field v-model="newPwd" placeholder="请输入更改的密码" v-if="active === 1" type="password" />
			<van-field v-model="finalPwd" placeholder="请确定密码" v-if="active === 2" type="password" />
		</div>
		<div style="display: flex;justify-content: flex-end;padding: 10px;">
			<van-button type="default" @click="prevStep" v-if="active!==0">上一步</van-button>
			<van-button type="info" @click="nextStep" v-if="active!==2" style="margin-left: 6px;">下一步</van-button>
			<van-button type="info" @click="sureChangePwd" v-if="active===2 && active!==0" style="margin-left: 6px;">确定</van-button>
		</div>
	</div>
</template>

<script>
	import md5 from 'js-md5';
	import {
		Toast
	} from "vant";
	import {
		changeUserPwd
	} from '../api'
	export default {
		data() {
			return {
				userid: "",
				userinfo: null,
				active: 0,
				originPwd: "",
				newPwd: "",
				finalPwd: ""
			};
		},
		mounted() {
			this.userinfo = this.$store.state.userInfo;
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1);
			},
			nextStep() {
				if (this.active === 0) {
					//	console.log(md5(this.originPwd))
					if (md5(this.originPwd) == this.userinfo.vuechatPassword) {
						this.active += 1;
					} else {
						Toast('密码不一致')
					}
				} else if (this.active === 1) {
					if (this.newPwd == '') {
						Toast('输入不能为空')
					} else {
						this.active += 1;
					}

				}

			},
			prevStep() {
				this.active -= 1;
			},
			async sureChangePwd() {
				// console.log(this.newPwd)
				// console.log(this.finalPwd)
				if (this.finalPwd == this.newPwd) {
					let changeInfo = {
						id: this.userid,
						changePwd: this.finalPwd
					};
					const result = await changeUserPwd(changeInfo);
					if (result.data.status === 2) {
						Toast(result.data.message);
						localStorage.removeItem("vuechatid");
						localStorage.removeItem("vuechattoken");
						this.$router.push("/login");

					} else {
						Toast(result.data.message);
					}
					//console.log(result)
					//更改密码请求
				} else {
					Toast('密码不一致')
				}

			}
		}
	}
</script>

// <style lang="less" scoped="scoped">
	// 	.inputs-div{
	// 		margin-top: 20px;
	// 	}
	//
</style>
