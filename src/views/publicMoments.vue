<template>
	<!-- 发表朋友圈页面 -->
	<div @click="faceShow=false">
		<van-nav-bar title="发表朋友圈" left-text="返回" left-arrow @click-left="onClickLeft">
			<template #right>
				<van-button type="primary" size="small" :disabled="isDisabled" @click="publicMoment">发表</van-button>
			</template>
		</van-nav-bar>
		<div class="edit-box">
			<van-field v-model="momentText" rows="6" autosize type="textarea" placeholder="这一刻的想法....." @input="inputMomentText"
			 ref="textareaRef" />
			<div class="face-box">
				<van-icon name="smile-o" style="margin-right:5px;" @click.stop="faceContent" size="24"/>
			</div>
			<div class="upload-box">
				<van-uploader v-model="imgList" multiple :max-count="2" :after-read="uploadImg" />
			</div>
		</div>

		<div class="local-box">
			<van-cell value="" is-link to="maplocation">
				<!-- 使用 title 插槽来自定义标题 -->
				<template #title>
					<van-icon name="location-o" size="18" />
					<span class="custom-title">{{location || '所在位置'}}</span>
				</template>
			</van-cell>
		</div>
		<!-- 表情区域部分 -->
		<ul class="facelist" v-show="faceShow">
			<li v-for="(item,index) in faceList" :key="index" @click.stop="getBrow(index)">{{item}}

			</li>
		</ul>
	


	</div>
</template>

<script>
	// import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
	import {
		Dialog,
		Toast
	} from "vant";
	import {
		publicWechatMoment
	} from '../api';
	import axios from 'axios'
	const emojData = require("@/assets/emojis.json");

	export default {
		data() {
			return {
			
				isDisabled: true, //控制按钮的高亮
				momentText: "", //朋友圈文本
				imgList: [],
				faceShow: false,
				faceList: [],
				userid: "",
				location: "",
				// likeCount: 0,
				// commentList: [],
				base64ImgList: [],
				latitudeAndlongitude:null
				
			};
		},
		// components: {
		//     BaiduMap
		//   },
		
		activated() {
			//document.body.style.backgroundColor = "#ffffff";
			this.userid = localStorage.getItem("vuechatid");
			if(this.$route.query.location){
				let location =JSON.parse(this.$route.query.location);
				this.location =location.addr;
				this.latitudeAndlongitude = location.point
				// console.log(this.location)
				// console.log(this.latitudeAndlongitude)
			}
		},
		methods: {
		
			onClickLeft() {
				// this.$router.go(-1)
				Dialog.confirm({
						title: "",
						message: "退出此编辑？",
					})
					.then(() => {
						// on confirm
						this.momentText = "";
						this.imgList = [];
						this.location = "";
						this.$router.push('/wechatmoments')
					})
					.catch(() => {
						// on cancel
					});
			},
			//输入框输入
			inputMomentText() {
				this.momentText == "" ? this.isDisabled = true : this.isDisabled = false;
			},
			onClickRight() {},
			faceContent() {
				//console.log(1)
				//this.faceList = []
				this.faceShow = !this.faceShow;
				this.faceList = [];
				this.$refs.textareaRef.foucs;
				if (this.faceShow == true) {
					for (let i in emojData) {
						this.faceList.push(emojData[i].char);
					}
				} else {
					this.faceList = [];
				}
			},
			//表情评论
			getBrow(index) {
				for (let i in this.faceList) {
					if (index == i) {
						//console.log(this.faceList[index]);
						//this.getBrowString = this.faceList[index];
						this.momentText += this.faceList[index];
					}
				}
			},
			uploadImg(file) {
				this.isDisabled = false
				// console.log(file)
			},
			//发表朋友圈
			async publicMoment() {
				const formData = new FormData();
				this.imgList.forEach((item, index) => {
					//console.log(index)
					this.base64ImgList.push(item.content)
					formData.append(`base64ImgList${index}`, item.content);
				})
				// let wechatmomentLocation = {
				// 	location:this.location,
				// 	latitudeAndlongitude:this.latitudeAndlongitude
				// }
				formData.append('vueChatId', this.userid);
				formData.append('momentText', this.momentText);
				formData.append('momentTime', new Date());
				formData.append('base64ImgListLength', this.base64ImgList.length);
				formData.append('location', this.location);
				formData.append('latitudeAndlongitude',JSON.stringify(this.latitudeAndlongitude))
				// formData.append('likeCount', this.likeCount);
				// formData.append('commentList', this.commentList);
				let headers = {
					headers: {
						"Content-Type": "multipart/form-data"
					}
				};
				const publicMomentApi = process.env.NODE_ENV==='development'?'/api/wechatmoment/publicMoment':'/wechatmoment/publicMoment'
				axios.post(publicMomentApi, formData, headers).then(res => {
					//console.log(res)
					this.momentText = '';
					this.imgList = [];
					this.location = "";
					if (res.data.status === 2) {
						Toast(res.data.message);
						this.$router.push('/wechatmoments')
					} else {
						Toast(res.data.message);
					}
				}).catch(err => {
					console.log(err)
				})
			}
		},
	};
</script>

<style lang="less" scoped>
	// App{
	//     background: #fff;
	// }
	.edit-box {
		//   margin-top: 46px;
		padding: 6px 0px;
		background: #fff;

		.upload-box {
			margin-top: 8px;
			padding: 0 16px;
		}
	}

	.local-box {
		margin-top: 10px;
	}

	.van-cell__title {
		display: flex;
		align-items: center;
	}

	.face-box {
		margin-top: 8px;
		padding: 0 16px;
	}

	.facelist {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		padding: 10px;
		background: #fff;
		position: fixed;
		bottom: 48px;
	}

	.bm-view {
		width: 100%;
		height: 300px;
	}
</style>
