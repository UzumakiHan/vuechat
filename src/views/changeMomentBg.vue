<template>
	<div>
	<van-nav-bar title="更改背景" left-text="返回" left-arrow @click-left="onClickLeft" />
	<div class="upload-container">
		<van-uploader :after-read="afterRead" v-model="fileList" :max-count="1"  :before-delete="beforeDelete"/>
		<van-button type="info" style="margin-top: 30px;width: 150px;" @click="changeMomentBg" :disabled="isChange" >更改</van-button>
	</div>
	
	</div>
</template>

<script>
	import axios from 'axios'
	import {
		Toast
	} from 'vant';
	export default {
		data(){
			return{
				fileList:[],
				base64Bg:"",
				isChange:true,
				userid:""
			}
		},
		mounted() {
			this.userid = localStorage.getItem("vuechatid");
		},
		methods:{
			onClickLeft(){
				this.$router.go(-1);
			},
		
			afterRead(file){
				this.base64Bg = file.content;
				this.isChange=false;
			},
			beforeDelete(file){
				this.fileList = [];
				this.isChange=true;
			},
			changeMomentBg(){
				//console.log(this.base64Bg)
				const formData = new FormData();
				formData.append('wechatMomentBg',this.base64Bg);
				formData.append('userid',this.userid);
				
				let headers = {
					headers: {
						"Content-Type": "multipart/form-data"
					}
				};
				axios.post("/api/user/changeMomentBg", formData, headers).then(res=>{
					//console.log(res)
					if(res.data.status === 2){
						Toast(res.data.message);
						this.$router.push('/wechatmoments')
					}else{
						Toast(res.data.message);
					}
				}).catch(err=>{
					console.log(err)
				})
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.upload-container{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 100px;
	}
	.van-uploader__upload{
		background-color: #D0DFE6 ;
		width: 150px ;
		height: 150px ;
	}
	.van-uploader__upload-icon{
		font-size: 30px;
		color: #79BEDB ;
	}
	.van-uploader__preview-image{
		width: 150px ;
		height: 150px ;
	}
</style>
