<template>
	<div @click="faceShow=false">
		<van-nav-bar :title="chatRoomTitle" :fixed="true" style="z-index:99" left-text="返回" left-arrow @click-left="onClickLeft">
			<template #right>
				<van-icon name="more" size="18" @click="goGrounpChatInfo" />
			</template>
		</van-nav-bar>
		<div class="chat-content" id="chatbox" ref="chatbox" v-if="chatRecordList.length > 0">

			<template v-for="(chatAccountItem,chatAccountIndex) in chatRecordList">
				<div class="chat-receiver" :key="chatAccountIndex" v-if="chatAccountItem.sendAccountId == userid ">
					<div>
						<img :src="chatAccountItem.sendAccountAvatar" />
					</div>
					<div>{{chatAccountItem.sendAccountName}}</div>
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
				<div class="chat-sender" :key="'info2-'+chatAccountIndex" v-else>
					<div @click="checkUserInfo(chatAccountItem)">
						<img :src="chatAccountItem.sendAccountAvatar" />
					</div>
					<div>{{chatAccountItem.sendAccountName}}</div>
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
					<!-- <div v-if="chatAccountItem.chatImg">
						<div class="chat-left_triangle"></div>
						<van-image width="100" height="100" :src="chatAccountItem.chatImg" @click="previewImg(chatAccountItem.chatImg)" />
						
					</div> -->
					<div class="chat-notice">
						<span>{{$moment(chatAccountItem.chatTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
					</div>
				</div>
			</template>

		</div>
		<ul class="facelist" v-show="faceShow">
			<li v-for="(item,index) in faceList" :key="index" @click.stop="getBrow(index)">{{item}}</li>
		</ul>

		<div class="send-box">
			<div class="voice-box" @click="showVoiceBlock">
				<van-icon :name="voice" v-if="voiceKeyBoardFlag" size="24" />
				<van-icon :name="keyboard" v-else size="24" />
			</div>
			<div class="input-box">
				<van-field v-model="chatMsg" class="vue-input" @keyup.enter="sendChatMsg" ref="sendinput" v-if="voiceKeyBoardFlag" />
				<van-button type="default" class="voice-btn" v-else>
					<van-icon :name="recordvoice" size="24" @click="recordingVoice" />
					<van-icon :name="sendvoice" size="24" style="margin-left:40px" @click="sendVoice" />
				</van-button>
			</div>
			<div class="other-box">
				<van-icon name="smile-o" style="margin-right:5px;" @click.stop="faceContent" size="24" />
				<van-uploader v-model="fileList" :after-read="uploadImg">
					<van-icon name="plus" size="24" />
				</van-uploader>
			</div>
		</div>
	</div>
</template>

<script>
	import "../assets/css/chatpage.css";
	import {
		Toast
	} from "vant";
	import axios from "axios";
	import {
		getGroupChatList,
		getChatUserInfo,
		getChatRoomInfo
	} from '../api'
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
				chatRoom: null,
				chatRoomId: "",
				chatRoomTitle: "",
				chatRoomName:'',
				chatRoomImg:'',
				avatar: require("../assets/images/avatar.jpg"),
				keyboard: require("../assets/images/keyboard.png"),
				voice: require("../assets/images/voice-circle.png"),
				recordvoice: require("../assets/images/voice.png"),
				sendvoice: require("../assets/images/send.png"),
				voiceKeyBoardFlag: true, //语音键盘切换
				chatMsg: "", //聊天文本
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
			}
		},
		// afterRouteEnter (to, from, next) {
		//        console.log(to);
			   
		// 	   this.beforeRouteEnterName =from.name;
		// 	     console.log(this.beforeRouteEnterName)
		//        // console.log(next)
		//        next();
		// },
		mounted() {
			// console.log(this.$route)
			this.userid = localStorage.getItem("vuechatid");
			this.sendUserInfo = this.$store.state.userInfo;
			this.getChatRoomInfo();
			this.socket = this.$socketio.connect(this.$socketHost, {
				transports: ["websocket", "xhr-polling", "jsonp-polling"]
			});
			this.socket.on("receiveGrounpChatMessage", msg => {
				//	console.log(msg)

				if (this.chatRoomId == msg.chatRoomId) {
					this.chatRecordList.push(msg)
					// console.log( this.chatRecordList)
					this.scrollToButtom()
				}


			});
			//this.getUserInfo();
			this.getGroupChatList()
			//console.log(this.chatRoom)
		},
		methods: {
			//获取聊天室信息
			async getChatRoomInfo() {
				this.chatRoomId = this.$route.query.id;
				// this.chatRoomId = this.chatRoom._id;
				const result = await getChatRoomInfo(this.chatRoomId);
				// console.log(result)
				if (result.data.status === 2) {
					this.chatRoom = result.data.chatRoomInfo;
					this.chatRoomTitle = `${this.chatRoom.chatRoomName}(${this.chatRoom.chatRoomMemberId.length})`;
					this.chatRoomName = this.chatRoom.chatRoomName;
					this.chatRoomImg = this.chatRoom.chatRoomImg;
				}

			},
			// async getUserInfo() {
			// 	this.userid = localStorage.getItem("vuechatid");
			// 	// console.log(this.userid);
			// 	const result = await this.$store.dispatch("getMyInfo", this.userid);
			// 	// console.log(result)
			// 	this.sendUserInfo = result;

			// 	//this.getDigtalChatMsgDetail();
			// },
			onClickLeft() {
				this.$router.go(-1)
				// this.$router.push('/mychatgrounp')
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
			//发送图片
			async uploadImg(file) {
				this.fileList = [];

				let chatRoomMemberId = this.chatRoom.chatRoomMemberId;
				let sendAccountAndchatRoomId = this.chatRoomId + this.userid;
				let chatMsgInfo = {
					chatRoomName:this.chatRoomName,
					chatRoomImg:this.chatRoomImg,
					chatRoomId: this.chatRoomId,
					chatMessage: '',
					chatImg: file.content,
					chatVoice: "",
					chatTime: new Date(),
					// sendAccountAndchatRoomId:sendAccountAndchatRoomId,
					sendAccountId: this.userid,
					sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
					sendAccountName: this.sendUserInfo.vuechatName,
					chatRoomMemberId: chatRoomMemberId
				};
				// console.log(chatMsgInfo)
				this.socket.emit("sendGrounpChatMessage", chatMsgInfo);
			},
			//图片预览
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
				axios
					.post("/chatlist/uploadChatVoice", formData, headers)
					.then(res => {
						//console.log(res)
						if (res.data.status === 2) {

							rc.clear();
							let chatVoiceMsg = res.data.chatVoiceMsg;
							// let chatRoomId = this.chatRoom._id;
							let chatRoomMemberId = this.chatRoom.chatRoomMemberId;
							let sendAccountAndchatRoomId = this.chatRoomId + this.userid;
							let chatMsgInfo = {
								chatRoomName:this.chatRoomName,
								chatRoomImg:this.chatRoomImg,
								chatRoomId: this.chatRoomId,
								chatMessage: "",
								chatImg: "",
								chatVoice: chatVoiceMsg,
								chatTime: new Date(),
								// sendAccountAndchatRoomId:sendAccountAndchatRoomId,
								sendAccountId: this.userid,
								sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
								sendAccountName: this.sendUserInfo.vuechatName,
								chatRoomMemberId: chatRoomMemberId
							};
							this.socket.emit("sendGrounpChatMessage", chatMsgInfo);
						}
					});

			},
			//发送消息
			async sendChatMsg() {
				// let chatRoomId = this.chatRoom._id;
				let chatRoomMemberId = this.chatRoom.chatRoomMemberId;
				let sendAccountAndchatRoomId = this.chatRoomId + this.userid;
				let chatMsgInfo = {
					chatRoomName:this.chatRoomName,
					chatRoomImg:this.chatRoomImg,
					chatRoomId: this.chatRoomId,
					chatMessage: this.chatMsg,
					chatImg: "",
					chatVoice: "",
					chatTime: new Date(),
					// sendAccountAndchatRoomId:sendAccountAndchatRoomId,
					sendAccountId: this.userid,
					sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
					sendAccountName: this.sendUserInfo.vuechatName,
					chatRoomMemberId: chatRoomMemberId
				};
				this.chatMsg = "";
				// console.log(chatMsgInfo)
				this.socket.emit("sendGrounpChatMessage", chatMsgInfo);
			},
			//获取所有聊天记录
			async getGroupChatList() {
				let chatRoomId = this.userid+this.chatRoomId;
				// let chatRoomId = this.chatRoomId;
				// console.log(chatRoomId)
				const result = await getGroupChatList(chatRoomId);
				 console.log(result)
				if (result.data.status === 2) {
					this.chatRecordList = result.data.groupChatList.reverse();
					this.scrollToButtom()
					let chatRecordListLength = this.chatRecordList.length;
					for (let i = 0; i < chatRecordListLength; i++) {
						if (this.chatRecordList[i].sendAccountId != this.userid) {
							//console.log(chatMag)
							const chatUserInfo = await getChatUserInfo(this.chatRecordList[i].sendAccountId);
							this.chatRecordList[i].sendAccountName = chatUserInfo.data.userinfo.vuechatName;
							this.chatRecordList[i].sendAccountAvatar = chatUserInfo.data.userinfo.vuechatAvatar;


						}
					}
				} else {
					Toast(result.data.message)
				}
			},
			//滚到底部
			scrollToButtom() {
				this.$nextTick(() => {
					let chatboxContainer = this.$refs.chatbox // 获取对象
					if (chatboxContainer) {
						document.body.scrollTop = chatboxContainer.scrollHeight // 滚动高度
						document.documentElement.scrollTop = chatboxContainer.scrollHeight
					}

				})

			},
			//播放语音
			playChatVoice(audio) {
				let audioUrl = audio;
				if (audioUrl) {

					let audioExample = new Audio();
					audioExample.src = audioUrl; //想要播放的音频地址
					audioExample.play();
				} else {
					Toast('语音地址已被摧毁');
				}

			},
			//跳转到群资料页面
			goGrounpChatInfo() {
				//console.log(this.chatRoom)
				this.$router.push({
					name: 'GrounpChatInfo',
					query: {
						id: this.chatRoomId
					}
				})
			},
			//查看用户资料
			async checkUserInfo(chatAccountItem){
				const result = await getChatUserInfo(chatAccountItem.sendAccountId);
				let userinfo = result.data.userinfo
			//	console.log(userinfo)
				this.$router.push({
					name: "ChatUserInfo",
					query: {
						userinfo: JSON.stringify(userinfo)
					}
				});
			}
		}
	}
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
