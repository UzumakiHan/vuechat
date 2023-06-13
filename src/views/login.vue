<template>
	<div class="login">
		<van-nav-bar :title="btnText" />
		<div class="logincontent">
			<van-row type="flex" justify="center" style="margin-bottom:20px;">
				<van-col>
					<van-image width="100" height="100" :src="wechatBg" />
				</van-col>
			</van-row>
			<van-cell-group>
				<van-field left-icon="user-o" v-model="vueChatName" required clearable label="用户名" placeholder="请输入用户名" v-if="!isHaveAccount" />
				<van-field left-icon="user-o" v-model="vueChatAccount" required clearable label="账号" placeholder="请输入vuechat号" />
				<van-row>
					<van-col span="21">
						<van-field left-icon="credit-pay" v-model="password" :type="type" label="密码" placeholder="请输入密码" required />
					</van-col>
					<van-col span="3" style="margin-top:12px;" @click="openeye" v-if="eye">
						<van-icon name="closed-eye" size="18" />
					</van-col>
					<van-col span="2" style="margin-top:12px" @click="openeye" v-else>
						<van-icon name="eye-o" size="18" />
					</van-col>
				</van-row>
				<van-row>
					<van-col span="18">
						<van-field :left-icon="codeImg" v-model="captcha" type="text" label="验证码" placeholder="请输入验证码" required />
					</van-col>
					<van-col span="6">
						<van-image width="80px" height="40px" :src="svgcaptcha" ref="captcha" @click.prevent="getCaptcha()" />
					</van-col>
					<!-- <svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0,0,150,50"><path d="M16 19 C59 38,82 30,146 28" stroke="#86dc6a" fill="none"/><path d="M17 42 C59 22,85 31,145 15" stroke="#7090ef" fill="none"/><path fill="#cf8fe4" d="M35.54 23.27L35.57 23.30L35.56 23.29Q33.86 19.23 27.66 19.42L27.58 19.35L27.66 19.42Q23.27 19.57 21.29 21.01L21.34 21.06L21.19 20.91Q18.78 22.65 18.78 26.76L18.88 26.86L18.85 28.70L18.90 28.75Q18.76 37.44 27.78 37.44L27.85 37.51L27.77 37.43Q30.01 37.61 31.50 36.81L31.34 36.65L31.37 36.68Q33.22 35.68 33.06 33.81L33.10 33.85L33.08 33.83Q32.98 31.83 29.29 30.91L29.29 30.91L27.27 30.83L27.26 30.82Q26.41 30.92 25.45 30.96L25.36 30.87L25.31 30.81Q25.38 29.94 25.34 28.03L25.22 27.91L25.27 27.96Q32.96 28.00 37.15 27.66L37.09 27.60L37.22 27.72Q37.04 28.43 37.04 29.23L37.18 29.36L37.18 29.37Q37.05 30.04 37.09 30.84L37.22 30.96L37.14 30.88Q36.02 30.86 36.02 30.86L36.14 30.99L36.06 30.91Q34.72 30.94 35.10 30.94L34.97 30.81L34.97 30.81Q36.17 32.54 36.55 34.52L36.52 34.49L36.48 34.45Q36.70 35.28 36.70 35.73L36.58 35.61L36.59 35.63Q36.69 40.37 27.90 40.37L27.84 40.31L27.77 40.24Q20.64 40.23 18.05 38.14L18.18 38.27L18.06 38.15Q16.23 35.94 16.23 30.88L16.24 30.88L16.08 30.72Q16.22 29.80 16.07 27.10L16.06 27.09L15.99 27.02Q15.83 24.65 15.87 23.28L15.80 23.21L15.89 23.30Q16.02 20.46 17.39 18.86L17.38 18.85L17.36 18.84Q20.00 16.87 24.88 16.68L24.72 16.52L27.48 16.54L27.49 16.55Q30.46 16.33 33.89 16.74L33.86 16.72L33.92 16.78Q37.77 17.35 38.72 20.59L38.67 20.53L38.65 20.52Q37.70 21.51 35.61 23.34ZM37.01 25.53L37.04 25.45L37.05 25.46Q38.31 24.44 40.17 22.46L40.10 22.38L40.13 22.41Q39.92 21.56 38.93 19.85L38.92 19.83L38.88 19.79Q37.60 17.03 33.79 16.38L33.88 16.47L33.87 16.46Q31.80 16.41 27.50 16.10L27.43 16.04L24.80 16.22L24.71 16.13Q19.49 16.28 16.90 18.26L17.07 18.43L17.06 18.41Q15.57 19.94 15.46 23.02L15.50 23.07L15.47 23.04Q15.61 22.72 15.84 28.20L15.80 28.16L15.78 28.14Q15.80 29.49 15.87 32.23L15.78 32.14L15.94 32.29Q15.95 36.57 17.70 38.51L17.81 38.62L17.75 38.56Q18.20 39.47 19.07 40.34L19.10 40.37L19.00 40.26Q21.99 42.23 27.51 42.57L27.38 42.44L30.24 42.60L30.31 42.67Q32.01 42.88 34.02 42.77L33.99 42.74L33.92 42.66Q35.46 42.68 37.55 42.14L37.42 42.01L37.45 42.04Q39.52 41.67 39.48 39.35L39.40 39.27L39.45 39.32Q39.34 37.96 38.27 35.18L38.36 35.26L38.41 35.32Q38.09 34.38 37.56 33.58L37.51 33.54L37.58 33.61Q38.17 33.63 39.35 33.82L39.31 33.78L39.35 33.82Q39.00 30.15 39.04 29.47L38.98 29.41L39.03 29.47Q38.73 29.54 38.31 29.50L38.15 29.34L38.16 29.35Q37.91 29.44 37.53 29.52L37.49 29.48L37.48 29.48Q37.56 28.45 37.64 27.38L37.45 27.20L37.53 27.28Q31.17 27.69 24.88 27.57L24.88 27.57L24.98 27.67Q25.08 28.64 25.08 29.56L24.98 29.46L24.95 31.18L25.07 31.30Q25.34 31.19 25.76 31.16L25.80 31.19L25.81 31.21Q26.19 31.17 26.65 31.17L26.71 31.23L26.71 31.22Q26.73 31.70 26.77 32.20L26.75 32.18L26.76 32.19Q26.77 32.66 26.73 33.15L26.63 33.05L26.77 33.19Q27.79 33.14 28.81 33.10L28.74 33.03L28.72 33.01Q29.77 33.03 30.80 33.07L30.87 33.14L30.91 33.19Q31.77 33.24 32.65 33.62L32.66 33.64L32.75 33.77L32.83 33.84Q32.99 35.37 31.31 36.29L31.26 36.24L31.18 36.16Q29.64 37.21 27.93 37.21L27.77 37.04L27.82 37.10Q24.00 37.12 21.56 35.37L21.52 35.33L21.62 35.43Q20.55 33.29 20.70 30.74L20.72 30.76L20.70 30.74Q21.14 26.08 22.99 24.08L22.91 24.00L22.96 24.05Q24.84 22.09 29.53 21.79L29.49 21.75L29.38 21.64Q33.13 21.51 35.08 23.30L35.11 23.34L35.14 23.36Q35.18 23.44 35.30 23.63L35.16 23.50L35.28 23.51L35.29 23.52Q36.06 24.39 36.63 25.50L36.63 25.51L37.01 25.54Z"/><path fill="#ecec7d" d="M56.37 41.05L56.41 41.09L56.21 40.89Q52.07 29.68 46.93 24.69L47.00 24.75L47.10 24.85Q48.44 25.35 51.41 26.00L51.44 26.04L51.50 26.10Q54.93 29.91 57.48 36.57L57.50 36.59L57.58 36.67Q60.27 29.35 62.90 26.30L62.89 26.29L62.73 26.13Q64.80 26.11 67.24 25.42L67.11 25.30L67.25 25.43Q63.96 28.04 61.79 32.61L61.78 32.61L61.84 32.66Q61.55 33.40 58.16 41.02L58.08 40.94L58.19 41.04Q57.50 41.04 56.28 40.97ZM61.04 43.52L61.05 43.52L60.92 43.40Q64.33 31.16 68.90 26.47L68.96 26.54L67.38 26.94L67.29 26.85Q66.67 27.25 65.83 27.37L65.72 27.26L65.77 27.31Q66.15 26.81 66.97 25.94L67.10 26.07L67.06 26.03Q67.83 25.10 68.29 24.68L68.36 24.76L68.31 24.71Q66.06 25.32 62.64 25.81L62.56 25.74L62.71 25.89Q59.91 28.98 57.85 34.58L57.99 34.71L57.91 34.64Q56.34 30.51 54.51 28.04L54.53 28.06L53.94 28.00L53.98 28.04Q53.63 27.96 53.40 27.96L53.46 28.02L53.43 27.98Q53.10 27.54 51.38 25.48L51.44 25.54L51.50 25.60Q48.04 24.99 45.79 23.85L45.87 23.92L45.95 24.01Q52.07 29.71 56.07 41.44L56.08 41.45L56.95 41.33L56.91 41.29Q57.39 42.08 58.23 43.37L58.16 43.30L59.60 43.37L59.63 43.40Q60.34 43.38 60.98 43.46Z"/><path fill="#d85e7d" d="M86.69 41.33L86.76 41.41L86.65 41.29Q83.77 41.46 82.51 40.93L82.59 41.00L82.50 40.91Q80.64 40.20 80.72 37.72L80.76 37.77L80.67 37.67Q80.77 34.24 80.77 34.81L80.77 34.81L80.91 34.94Q80.93 29.64 78.08 24.80L77.95 24.67L77.93 24.66Q79.96 25.66 81.94 26.04L82.00 26.10L81.91 26.01Q83.72 30.72 83.61 35.21L83.57 35.17L83.62 35.22Q83.40 36.64 84.24 37.86L84.26 37.88L84.33 37.94Q85.21 39.24 86.73 39.05L86.60 38.92L87.00 38.82L87.05 38.88Q88.48 38.90 89.30 38.14L89.13 37.97L89.23 38.07Q90.08 37.34 90.08 36.38L90.06 36.37L90.08 36.39Q90.03 36.11 89.99 35.92L89.95 35.88L89.91 35.84Q89.96 30.71 91.10 26.37L91.09 26.36L90.98 26.25Q92.06 26.22 93.05 25.99L93.02 25.96L95.16 25.59L95.02 25.45Q92.56 30.56 92.86 36.12L92.94 36.20L92.91 36.18Q93.04 39.20 91.33 40.34L91.40 40.41L91.30 40.31Q90.12 41.30 86.81 41.45ZM89.04 43.76L88.95 43.67L89.05 43.77Q92.53 43.94 94.36 43.18L94.32 43.14L94.33 43.15Q95.17 42.32 95.17 40.91L95.33 41.07L95.17 40.91Q95.19 40.01 94.92 38.45L94.90 38.43L95.02 38.55Q94.51 35.37 94.89 32.37L94.87 32.34L94.99 32.47Q95.28 29.22 96.69 26.48L96.79 26.58L96.65 26.44Q96.00 26.73 94.66 27.15L94.77 27.26L94.66 27.14Q95.02 26.67 95.32 26.10L95.24 26.01L95.80 24.86L95.81 24.88Q93.97 25.63 90.82 26.12L90.66 25.96L90.75 26.05Q89.55 30.87 89.70 35.97L89.69 35.96L89.60 35.87Q89.73 38.02 87.07 38.51L87.04 38.48L86.70 38.60L86.48 38.54L85.53 38.39L85.62 38.48Q85.50 37.56 85.54 37.06L85.46 36.98L85.55 37.08Q85.80 32.61 85.12 28.19L85.06 28.14L83.96 27.95L84.11 28.09Q83.49 27.97 82.96 27.86L82.96 27.86L82.99 27.88Q82.65 26.52 82.38 25.76L82.31 25.69L82.39 25.77Q79.45 25.19 77.21 23.90L77.37 24.06L77.25 23.94Q79.44 27.50 80.16 30.88L80.10 30.82L80.13 30.85Q80.57 33.01 80.42 36.51L80.44 36.53L80.40 36.49Q80.57 36.77 80.49 37.87L80.41 37.79L80.42 37.80Q80.38 40.28 81.75 41.23L81.73 41.21L81.63 41.11Q82.05 43.39 89.05 43.77Z"/><path fill="#6faae6" d="M115.32 29.02L115.36 29.06L115.46 29.16Q113.53 28.94 112.29 30.37L112.39 30.47L112.41 30.49Q111.14 31.88 110.95 33.78L110.99 33.83L110.89 33.73Q110.63 35.75 111.72 36.72L111.84 36.85L111.75 36.76Q112.89 37.78 114.98 37.67L115.05 37.73L114.89 37.57Q117.10 37.53 118.20 36.85L118.07 36.72L118.12 36.77Q119.33 35.74 119.33 34.18L119.29 34.13L119.34 34.19Q119.23 33.69 119.16 33.31L119.12 33.28L119.13 33.29Q119.25 31.65 118.15 30.30L118.22 30.38L118.29 30.45Q117.08 28.99 115.40 29.10ZM115.02 40.25L114.94 40.18L114.96 40.19Q110.67 40.29 109.27 39.53L109.15 39.41L109.29 39.55Q108.22 38.75 108.03 37.04L107.96 36.97L107.96 36.96Q107.87 36.23 107.91 35.50L107.95 35.55L108.07 35.66Q108.20 34.69 108.20 34.24L108.12 34.15L108.19 34.22Q108.61 31.34 108.77 30.65L108.70 30.59L108.71 30.60Q109.20 28.69 110.04 27.28L110.08 27.32L109.91 27.15Q112.77 22.97 118.71 16.61L118.70 16.61L118.59 16.49Q121.20 16.13 123.41 15.33L123.44 15.36L123.56 15.49Q116.53 22.77 113.33 26.99L113.41 27.08L113.49 27.15Q114.50 26.68 115.79 26.68L115.66 26.54L115.81 26.70Q119.08 26.65 120.60 28.59L120.55 28.54L120.46 28.45Q121.80 30.09 122.14 33.63L122.25 33.74L122.27 33.76Q122.28 34.42 122.28 35.03L122.23 34.97L122.34 35.08Q122.31 38.18 120.10 39.24L120.00 39.14L120.19 39.33Q118.95 39.92 115.06 40.30ZM117.28 42.63L117.37 42.72L117.28 42.63Q118.56 42.58 120.54 42.65L120.56 42.67L120.61 42.72Q122.18 42.73 123.74 42.01L123.71 41.98L123.74 42.01Q124.95 41.31 124.95 39.52L124.88 39.46L124.79 39.37Q124.90 38.98 124.73 37.99L124.67 37.93L124.78 38.04Q124.42 36.86 124.42 36.40L124.43 36.41L124.55 36.54Q123.60 31.74 122.00 29.84L122.02 29.86L122.07 29.91Q121.90 29.70 121.75 29.47L121.76 29.48L121.53 29.33L121.51 29.35L121.50 29.34Q121.08 28.77 120.47 27.82L120.52 27.87L120.48 27.83Q119.65 26.96 117.68 26.50L117.52 26.35L117.59 26.41Q118.88 24.89 121.85 21.20L121.71 21.06L126.03 15.86L125.92 15.75Q124.40 16.67 122.00 17.43L122.10 17.52L122.13 17.55Q122.93 16.45 124.72 14.47L124.76 14.52L124.71 14.46Q122.35 15.57 118.47 16.14L118.44 16.11L118.47 16.14Q112.76 22.04 109.79 26.99L109.73 26.93L109.87 27.07Q108.28 29.52 107.71 35.76L107.62 35.67L107.78 35.84Q107.55 36.25 107.63 37.20L107.68 37.25L107.68 37.26Q107.80 39.05 108.90 39.96L108.77 39.83L108.88 39.94Q109.29 40.12 109.26 40.16L109.28 40.18L109.16 40.07Q109.62 41.06 110.41 41.47L110.47 41.53L110.40 41.46Q111.89 42.19 113.83 42.38L113.74 42.29L113.84 42.38Q113.76 42.31 117.26 42.61ZM117.12 31.47L116.99 31.34L117.08 31.43Q117.57 31.23 118.52 31.72L118.58 31.79L118.57 31.78Q118.88 32.70 118.88 33.35L118.90 33.36L118.91 33.37Q119.13 35.27 118.18 36.26L118.09 36.17L118.11 36.19Q117.12 36.99 115.02 37.29L114.97 37.23L115.06 37.33Q113.55 37.27 113.02 37.00L113.01 36.99L113.06 37.04Q112.86 36.58 112.86 36.27L112.84 36.25L112.80 36.20Q112.57 32.94 115.51 31.64L115.51 31.65L115.55 31.68Q116.22 31.25 116.98 31.33Z"/></svg> -->
				</van-row>
			</van-cell-group>
			<van-row style="margin-top:20px">
				<van-button type="info" size="large" @click="LoginOrRegister">{{btnText}}</van-button>
			</van-row>
			<van-row style="margin-top:10px;padding:6px 10px;" type="flex" justify="space-between">
				<van-col class="forget">忘记密码</van-col>
				<van-col class="register" @click="loginOrRes">{{loginOrResText}}</van-col>
			</van-row>
		</div>
	</div>
</template>
<script>
	import {
		vueChatRegister,
		getCaptchaSvg,
		vueChatLogin
	} from "../api";
	import Vue from "vue";
	import {
		Toast
	} from "vant";
	Vue.use(Toast);
	export default {
		name: "login",
		data() {
			return {
				vueChatName: "",
				password: "",
				vueChatAccount: "",
				captcha: "",
				eye: true,
				type: "password",
				svgcaptcha: "",
				user_id: "",
				codeImg: require("../assets/images/code.png"),
				wechatBg: require("../assets/images/wechatbg.png"),
				isHaveAccount: true, //是否有账号
				btnText: "登录",
				loginOrResText: "注册新用户",
				captchaText: "",
				defaultAvatar: "http://42.194.193.249:3270/upload/image-1606295429398.jpg"
			};
		},
		mounted() {
			this.getCaptcha();
		},
		methods: {
			openeye() {
				if (this.eye) {
					this.eye = !this.eye;
					this.type = "text";
				} else {
					this.eye = true;
					this.type = "password";
				}
			},
			register() {
				this.$router.push("/register");
			},
			async getCaptcha() {
				const captchaApi = process.env.NODE_ENV==='development'?process.env.VUE_DEV_HOST:process.env.VUE_PRO_HOST;
				this.svgcaptcha = `${captchaApi}/user/captcha?time=${new Date()}`

			},
			async LoginOrRegister() {
				if (this.isHaveAccount) {
					if (
						this.vueChatAccount == "" ||
						this.password == "" ||
						this.captcha == ""
					) {
						Toast("请输入完整的信息");
					} else {
						const userInfo = {
							vueChatAccount: this.vueChatAccount,
							vueChatpassword: this.password,
							vueChatCaptcha: this.captcha
						};
						//	console.log(userInfo);
						//登录
						const result = await vueChatLogin(userInfo);
						console.log(result);
						if (result.data.status === 0) {
							Toast(result.data.message);
							this.getCaptcha();
						} else if (result.data.status === 1) {
							Toast(result.data.message);
						} else if (result.data.status === 2) {
							
							Toast(result.data.message);
							this.vueChatName = this.vueChatAccount = this.password = this.captcha =
								"";
							localStorage.setItem('vuechattoken', 'true')
							localStorage.setItem('vuechatid', result.data.userInfo._id)
							this.$router.push('/')
						}
						// this.vueChatName = this.vueChatAccount = this.password = this.captcha =
						// 	"";
					}
				} else {
					if (
						this.vueChatAccount == "" ||
						this.password == "" ||
						this.captcha == "" ||
						this.vueChatName == ""
					) {
						Toast("请输入完整的信息");
					} else {
						//用户名正则，6到16位（字母，数字，下划线，减号）
						let nameFilter = /^[a-zA-Z0-9_-]{6,16}$/;
						//密码正则，8到16位（字母，数字）
						let pwdFilter = new RegExp("^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
						if(!nameFilter.test(this.vueChatAccount)){
							Toast('请输入vuechat账号为6到16位（字母，数字，下划线，减号）')
						}else if(!pwdFilter.test(this.password)){
							Toast('请输入密码为8位以上并且字母、数字、特殊字符三项中有两项')
						}else{
							console.log(1)
							const userInfo = {
								vueChatName: this.vueChatName,
								vueChatAccount: this.vueChatAccount,
								vueChatpassword: this.password,
								vueChatCaptcha: this.captcha,
								vuechatAvatar: this.defaultAvatar
							};
							//	console.log(userInfo);
							//注册
							const result = await vueChatRegister(userInfo);
							console.log(result);
							if (result.data.status === 0) {
								Toast(result.data.message);
								this.getCaptcha();
							} else if (result.data.status === 1) {
								Toast(result.data.message);
							} else if (result.data.status === 2) {
								Toast(result.data.message);
								this.vueChatName = this.vueChatAccount = this.password = this.captcha =
									"";
							
							}
							//this.vueChatName = this.vueChatAccount = this.password = this.captcha ="";
						}
						
					}
				}
			},
			//注册或返回登录
			loginOrRes() {
				this.getCaptcha();
				this.vueChatName = this.vueChatAccount = this.password = this.captcha =
					"";
				if (this.isHaveAccount) {
					this.btnText = "注册";
					this.loginOrResText = "已有账号，返回登录";
				} else {
					this.btnText = "登录";
					this.loginOrResText = "注册新用户";
				}
				this.isHaveAccount = !this.isHaveAccount;
			}
		}
	};
</script>
<style lang="less" scoped>
	.logincontent {
		margin-top: 80px;

		.forget {
			font-size: 16px;
			text-align: center;
			color: rgb(255, 68, 0);

			&:hover {
				cursor: pointer;
				text-decoration: none;
			}
		}

		.register {
			font-size: 16px;
			color: #007bff;
			text-align: center;

			&:hover {
				cursor: pointer;
				text-decoration: none;
			}
		}
	}
</style>
