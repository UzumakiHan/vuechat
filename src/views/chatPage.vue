<template>
	<div @click="faceShow=false">
		<van-nav-bar :title="userinfo.vuechatName" :fixed="true" left-text="返回" left-arrow @click-left="onClickLeft">
			<template #right>
				<van-icon name="more" size="18" @click="checkVueChatAccount" />
			</template>
		</van-nav-bar>
		<!-- <audio ref="audioUrlRefText"src="http://127.0.0.1:3000/chatVoiceUpload/hXYpVvQiyENew-6GfCI92-y2.wav"/> -->
		<div class="chat-content" v-if="chatRecordList.length > 0" id="chatbox" ref="chatbox">
			<template v-for="(chatAccountItem,chatAccountIndex) in chatRecordList">
				<div class="chat-receiver" :key="chatAccountIndex" v-if="chatAccountItem.sendAccountId == sendUserInfo._id ">
					<div @click="checkUserInfo(sendUserInfo)">
						<img :src="sendUserInfo.vuechatAvatar" />
					</div>
					<div>{{sendUserInfo.vuechatName}}</div>
					<div v-if="chatAccountItem.chatMessage">
						<div class="chat-right_triangle"></div>
						<span>{{chatAccountItem.chatMessage}}</span>
					</div>
					<div v-if="chatAccountItem.chatVoice.chatVoiceUrl">
						<div class="chat-right_triangle"></div>
						<div class="chat-voice" style=" margin: 0 ;padding: 0;color: #222;font-size: 14px;text-align: left;display:flex;align-items: center"
						 @click="playChatVoice(chatAccountItem.chatVoice.chatVoiceUrl)">
							<van-icon :name="voice" size @click="recordingVoice" />
							<span style="margin-left:6px">{{chatAccountItem.chatVoice.chatVoiceTime}}s</span>
						</div>
					</div>
					<div v-if="chatAccountItem.chatImg" id="chat-img">
						<!-- <div class="chat-right_triangle"></div> -->
						<van-image :src="chatAccountItem.chatImg" @click="previewImg(chatAccountItem.chatImg)" />
						<!-- <span>{{chatAccountItem[userinfo.vuechatAccount].chatMessage}}</span> -->
					</div>
					<div class="chat-notice">
						<span>{{$moment(chatAccountItem.chatTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
					</div>
				</div>
				
				<!-- Right -->
				<div class="chat-sender" :key="'info2-'+chatAccountIndex" v-if="chatAccountItem.targetAccountId == sendUserInfo._id">
					<div @click="checkUserInfo(userinfo)">
						<img :src="userinfo.vuechatAvatar" />
					</div>
					<div>{{userinfo.vuechatName}}</div>
					<div v-if="chatAccountItem.chatMessage">
						<div class="chat-left_triangle"></div>
						<span>{{chatAccountItem.chatMessage}}</span>
					</div>
					<div v-if="chatAccountItem.chatVoice.chatVoiceUrl">
						<div class="chat-left_triangle"></div>
						<div class="chat-voice" style=" margin: 0 ;
						padding: 0;
						color: #222;
						font-size: 14px;
						text-align: left;display:flex;align-items: center"
						 @click="playChatVoice(chatAccountItem.chatVoice.chatVoiceUrl)">
							<van-icon :name="voice" size @click="recordingVoice" />
							<span style="margin-left:16px">{{chatAccountItem.chatVoice.chatVoiceTime}}s</span>
						</div>
					</div>
					<div v-if="chatAccountItem.chatImg" id="chat-img">
						<!-- <div class="chat-right_triangle"></div> -->
						<van-image :src="chatAccountItem.chatImg" @click="previewImg(chatAccountItem.chatImg)" />
						<!-- <span>{{chatAccountItem[userinfo.vuechatAccount].chatMessage}}</span> -->
					</div>
					<div class="chat-notice">
						<span>{{$moment(chatAccountItem.chatTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
					</div>
				</div>
			</template>
		</div>
		<!-- 表情区域部分 -->
		<ul class="facelist" v-show="faceShow">
			<li v-for="(item,index) in faceList" :key="index" @click.stop="getBrow(index)">{{item}}</li>
		</ul>

		<div class="send-box">
			<div class="voice-box" @click="showVoiceBlock">
				<van-icon :name="voice" v-if="voiceKeyBoardFlag"  size="24"/>
				<van-icon :name="keyboard" v-else  size="24"/>
			</div>
			<div class="input-box">
				<van-field v-model="chatMsg" class="vue-input" @keyup.enter="sendChatMsg" ref="sendinput" v-if="voiceKeyBoardFlag" />
				<van-button type="default" class="voice-btn" v-else>
					<van-icon :name="recordvoice" size="24" @click="recordingVoice" />
					<van-icon :name="sendvoice" size="24" style="margin-left:40px" @click="sendVoice" />
				</van-button>
			</div>
			<div class="other-box">
				<van-icon name="smile-o" style="margin-right:5px;" @click.stop="faceContent"  size="24"/>
				<van-uploader v-model="fileList" :after-read="uploadImg">
					<van-icon name="plus"  size="24"/>
				</van-uploader>
			</div>
		</div>

	</div>
</template>
<script>
	// import moment from "moment";
	import "../assets/css/chatpage.css";
	import {
		getDigtalChatMsg,
		sendOffLineMessage,
		getChatUserInfo
	} from "../api";
	import {
		Toast
	} from "vant";
	import axios from "axios";
	const emojData = require("@/assets/emojis.json");
	import Recorderx, {
		ENCODE_TYPE
	} from "recorderx";
	const rc = new Recorderx();
	import {
		ImagePreview
	} from "vant";
	export default {
		data() {
			return {
				avatar: require("../assets/images/avatar.jpg"),
				keyboard: require("../assets/images/keyboard.png"),
				voice: require("../assets/images/voice-circle.png"),
				recordvoice: require("../assets/images/voice.png"),
				sendvoice: require("../assets/images/send.png"),
				voiceKeyBoardFlag: true, //语音键盘切换
				chatMsg: "", //聊天文本
				userinfo: {}, //当前聊天用户的资料
				userid: "", //用户id
				sendUserInfo: {},
				chatRecordList: [], //聊天记录
				onlineUserList: [], //在线用户
				faceList: [], //表情数组
				faceShow: false,
				fileList: [], //图片
				timeOutEvent: 0,
				startime: 0,
				endtime: 0,
				friendsList:null
			};
		},
		mounted() {

			this.userinfo = JSON.parse(this.$route.query.userinfo);
			// this.scrollToButtom()
			this.userid = localStorage.getItem("vuechatid");
			this.friendsList = this.$store.state.userInfo.friendsList;
			this.sendUserInfo = this.$store.state.userInfo;
			// console.log()
			this.socket = this.$socketio.connect(this.$socketHost, {
				transports: ["websocket", "xhr-polling", "jsonp-polling"]
			});
			this.socket.on("receiveChatMessage", msg => {
				//console.log(msg)
				this.chatRecordList.push(msg)
				this.scrollToButtom()

			});
			this.socket.on("receiveOffLineChatMessage", msg => {
				//console.log(msg)
				this.chatRecordList.push(msg)
				this.scrollToButtom()

			});

		this.getDigtalChatMsgDetail();
			this.socket.emit("online", this.userid);
			this.socket.on("userlist", msg => {
				//console.log(msg)
				localStorage.setItem("userlistId", JSON.stringify(msg));
			});
			// if (this.userid) {

			// }

		},
		//  updated(){
		//       this.scrollToButtom()
		//   },
		methods: {
			onmousedown() {
				//console.log(1);
				let that = this;
				rc.start()
					.then(() => {
						//console.log("start recording");
					})
					.catch(error => {
						//console.log("Recording failed.", error);
					});
			},
			onmouseup() {
				//console.log(2);
				this.statusaudio = true;
				rc.pause();
			},

			onClickLeft() {
				this.$router.go(-1);
			},
			//查看资料
			checkVueChatAccount() {
				this.$router.push({
					name: "ChatUserInfo",
					query: {
						userinfo: JSON.stringify(this.userinfo)
					}
				});
			},
			//发送聊天信息
			async sendChatMsg() {
				//	const result = await this.$store.dispatch("getMyInfo", this.userid);
					// console.log(result)
					//let friendsList = this.$store.state.userInfo.friendsList;
					let isFriend = this.friendsList.findIndex(id=> id == this.userinfo._id);
					// console.log(isFriend)
					if(isFriend === -1){
						Toast('对方不是你的好友。')
					}else{
						if (this.chatMsg.trim() == "") {
							Toast("发送不能为空");
						} else {
							this.onlineUserList = JSON.parse(localStorage.getItem("userlistId"));
							//  console.log( this.onlineUserList)
							let idx = this.onlineUserList.findIndex(
								item => item == this.userinfo._id
							); //1:在线，0不在线
							//console.log(this.userid);
							let sendChatMsgInfo = {
								sendAccountId: this.userid,
								targetAccountId: this.userinfo._id,
								chatMessage: this.chatMsg,
								chatImg: "",
								chatTime: new Date(),
								chatVoice: "",
								targetAccountAvatar: this.userinfo.vuechatAvatar,
								sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
								targetAccountName: this.userinfo.vuechatName,
								sendAccountName: this.sendUserInfo.vuechatName,
								sendAccountAndTargetAccountId: this.userid+this.userinfo._id
							};
							let targetChatMsgInfo = {
								sendAccountId: this.userid,
								targetAccountId: this.userinfo._id,
								chatMessage: this.chatMsg,
								chatImg: "",
								chatTime: new Date(),
								chatVoice: "",
								targetAccountAvatar: this.userinfo.vuechatAvatar,
								sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
								targetAccountName: this.userinfo.vuechatName,
								sendAccountName: this.sendUserInfo.vuechatName,
								sendAccountAndTargetAccountId: this.userinfo._id+this.userid
							};
							let chatInfoArr = [sendChatMsgInfo,targetChatMsgInfo]
						
							if (idx === -1) {
								//console.log(chatMsgInfo);
								this.socket.emit("sendOffLineChatMessage", chatInfoArr);
							
							} else {
								//console.log(chatMsgInfo);
									this.socket.emit("sendChatMessage", chatInfoArr);
							}
							this.chatMsg = "";
						}
					}
				
			},
			
			//获取聊天内容
			async getDigtalChatMsgDetail() {
				//console.log(11)
				let chatMsgInfo = {
					targetAccountId: this.userinfo._id,
					sendAccountId: this.userid
				};
				//  console.log(chatMsgInfo)
				const result = await getDigtalChatMsg(chatMsgInfo);
				this.chatRecordList = this.MsgSort(result.data.chatDigtalList);
				this.scrollToButtom()
				//console.log(this.chatRecordList);
			},
			//查看用户资料
			checkUserInfo(userinfo) {
				console.log(userinfo)
				this.$router.push({
					name: "ChatUserInfo",
					query: {
						userinfo: JSON.stringify(userinfo)
					}
				});
			},
			//获取所有表情
			faceContent() {
				//this.faceList = []
				this.faceShow = !this.faceShow;
				this.faceList = [];
				this.$refs.sendinput.foucs;
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
						this.chatMsg += this.faceList[index];
					}
				}
			},
			async uploadImg(file) {
				//console.log(file)
				this.fileList = [];

				this.onlineUserList = JSON.parse(localStorage.getItem("userlistId"));
				//  console.log( this.onlineUserList)
				//const result = await this.$store.dispatch("getMyInfo", this.userid);
				// console.log(result)
				//let friendsList = this.$store.state.userInfo.friendsList;
				let isFriend = this.friendsList.findIndex(id=> id == this.userinfo._id);
				// console.log(isFriend)
				if(isFriend === -1){
					Toast('对方不是你的好友。');
				}else{
					let idx = this.onlineUserList.findIndex(
						item => item == this.userinfo._id
					); //-1不在线
					//console.log(idx);
					let sendChatMsgInfo = {
						sendAccountId: this.userid,
						targetAccountId: this.userinfo._id,
						chatMessage: "",
						chatImg: file.content,
						chatTime: new Date(),
						chatVoice: "",
						targetAccountAvatar: this.userinfo.vuechatAvatar,
						sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
						targetAccountName: this.userinfo.vuechatName,
						sendAccountName: this.sendUserInfo.vuechatName,
						sendAccountAndTargetAccountId: this.userid+this.userinfo._id
					};
					let targetChatMsgInfo = {
						sendAccountId: this.userid,
						targetAccountId: this.userinfo._id,
						chatMessage: "",
						chatImg: file.content,
						chatTime: new Date(),
						chatVoice: "",
						targetAccountAvatar: this.userinfo.vuechatAvatar,
						sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
						targetAccountName: this.userinfo.vuechatName,
						sendAccountName: this.sendUserInfo.vuechatName,
						sendAccountAndTargetAccountId: this.userinfo._id+this.userid
					};
					let chatInfoArr = [sendChatMsgInfo,targetChatMsgInfo]
					
					if (idx === -1) {
						//console.log(chatMsgInfo);
						
						this.socket.emit("sendOffLineChatMessage", chatInfoArr);
					} else {
						//console.log(chatMsgInfo);
						this.socket.emit("sendChatMessage", chatInfoArr);
					}
				}
				
			},
			previewImg(img) {
				//console.log(img)
				let imglist = [];
				imglist.push(img);
				ImagePreview(imglist);
			},
			//显示语音录制区域
			showVoiceBlock() {
				rc.clear();
				this.voiceKeyBoardFlag = !this.voiceKeyBoardFlag;
			},
			//    gotouchstart(){

			//    clearTimeout(this.timeOutEvent);//清除定时器
			//    this.timeOutEvent = 0;
			//    this.timeOutEvent = setTimeout(function(){
			//         //执行长按要执行的内容，
			//       console.log('start')
			//      },600);//这里设置定时
			//  },
			//       //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
			// gotouchend(){
			//     clearTimeout(this.timeOutEvent);
			//       if(this.timeOutEvent!=0){
			//         console.log('end')
			//         //这里写要执行的内容（尤如onclick事件）
			//      }
			// },
			// //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
			// gotouchmove(){
			//      clearTimeout(this.timeOutEvent);//清除定时器
			//      this.timeOutEvent = 0;
			// },
			//录制语音
			recordingVoice() {
				// that.news_img = !that.news_img
				rc.start()
					.then(() => {
						this.startime = new Date();
					})
					.catch(error => {
						alert("获取麦克风失败");
					});
			},
			//发送语音
			async sendVoice() {
				
				rc.pause();
				this.endtime = new Date();
				let wav = rc.getRecord({
					encodeTo: ENCODE_TYPE.WAV,
					compressible: true
				});
				let voiceTime = Math.ceil((this.endtime - this.startime) / 1000);
				const formData = new FormData();

				formData.append("chatVoice", wav, Date.parse(new Date()) + ".wav");
				formData.append("voiceTime", voiceTime);
				let headers = {
					headers: {
						"Content-Type": "multipart/form-data"
					}
				};
				//const result = await this.$store.dispatch("getMyInfo", this.userid);
				// console.log(result)
				//let friendsList = this.$store.state.userInfo.friendsList;
				let isFriend = this.friendsList.findIndex(id=> id == this.userinfo._id);
				if(isFriend=== -1){
					Toast('对方不是你的好友。');
				}else{
					axios
						.post("/chatlist/uploadChatVoice", formData, headers)
						.then(res => {
							//console.log(res)
							if (res.data.status === 2) {
					
								rc.clear();
								let chatVoiceMsg = res.data.chatVoiceMsg;
								this.onlineUserList = JSON.parse(
									localStorage.getItem("userlistId")
								);
								let idx = this.onlineUserList.findIndex(
									item => item == this.userinfo._id
								); //1:在线，0不在线
								let sendChatMsgInfo = {
									sendAccountId: this.userid,
									targetAccountId: this.userinfo._id,
									chatMessage: '',
									chatImg: "",
									chatTime: new Date(),
									chatVoice: chatVoiceMsg,
									targetAccountAvatar: this.userinfo.vuechatAvatar,
									sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
									targetAccountName: this.userinfo.vuechatName,
									sendAccountName: this.sendUserInfo.vuechatName,
									sendAccountAndTargetAccountId: this.userid+this.userinfo._id
								};
								let targetChatMsgInfo = {
									sendAccountId: this.userid,
									targetAccountId: this.userinfo._id,
									chatMessage: '',
									chatImg: "",
									chatTime: new Date(),
									chatVoice: chatVoiceMsg,
									targetAccountAvatar: this.userinfo.vuechatAvatar,
									sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
									targetAccountName: this.userinfo.vuechatName,
									sendAccountName: this.sendUserInfo.vuechatName,
									sendAccountAndTargetAccountId: this.userinfo._id+this.userid
								};
								let chatInfoArr = [sendChatMsgInfo,targetChatMsgInfo]
					
								if (idx === 1) {
									//console.log(chatMsgInfo);
									this.socket.emit("sendChatMessage", chatInfoArr);
								} else {
									//console.log(chatMsgInfo);
									this.socket.emit("sendOffLineChatMessage", chatInfoArr);
								}
							}
						});
				}
				
			},
			scrollToButtom() {
				this.$nextTick(() => {
					let chatboxContainer = this.$refs.chatbox // 获取对象
					if (chatboxContainer) {
						document.body.scrollTop = chatboxContainer.scrollHeight // 滚动高度
						document.documentElement.scrollTop = chatboxContainer.scrollHeight
					}

				})

			},
			playChatVoice(audio) {
				let audioUrl = audio;
				if(audioUrl){
					
					let audioExample = new Audio();
					audioExample.src = audioUrl; //想要播放的音频地址
					audioExample.play();
				}else{
					Toast('语音地址已被摧毁');
				}
				
			},
			MsgSort(arr) {
				arr.sort((a, b) => {
					let t1 = new Date(a.chatTime)
					let t2 = new Date(b.chatTime)
					return t1.getTime() - t2.getTime()
				})
				return arr
			},
		}
	};
</script>
<style lang="less" scoped>
	.van-nav-bar .van-icon {
		color: #fff;
	}

	.van-nav-bar__text {
		color: #fff !important;
	}

	.chat-content {
		margin-top: 50px;
		margin-bottom: 50px;
		padding: 10px;

		span {
			font-size: 14px;
			word-break: break-all;
		}
	}

	.send-box {
		display: flex;
		align-items: center;
		z-index: 999;
		position: fixed;
		bottom: 0;
		padding: 6px;
		background: #ddd;
		right: 0;
		left: 0;

		.voice-box {
			display: flex;
			align-items: center;
		}

		.input-box {
			margin-left: 10px;
			margin-right: 6px;

			.vue-input {
				width: 270px;
				padding: 6px;
			}

			.voice-btn {
				width: 270px;
				height: 36px;
				// padding: 6px;
			}
		}

		.other-box {
			display: flex;
			align-items: center;
		}
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

	.chat-voice {
		margin: 0;
		padding: 0;
		color: #848484;
		font-size: 14px;
		text-align: left;
	}
</style>
