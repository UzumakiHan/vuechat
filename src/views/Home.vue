<template>
	<div class="home">
		<van-nav-bar title="首页" />
		<van-list v-if="allChatList.length > 0">
			<van-cell v-for="(item,index) in allChatList" :key="index" @click="sendMessage(item)" v-if="item.targetAccountAvatar || item.chatRoomId">


				<!-- <van-image width="50" height="50" :src="item.targetAccountAvatar" /> -->
				<van-image width="50" height="50" :src="item.chatRoomImg" v-if="item.chatRoomId" />
				<van-image width="50" height="50" :src="item.sendAccountId == $store.state.userInfo._id?item.targetAccountAvatar:item.sendAccountAvatar"
				 v-else />
				<div class="chat-info" v-if="item.chatRoomId">
					<p class="chat-title"  style=" justify-content: space-between;">
						<span>{{item.chatRoomName}}</span>
						<span class="chat-time">{{$moment(item.chatTime).format('HH:mm:ss')}}</span>
					</p>
					<p v-if="item.chatMessage" class="chat-content">{{item.sendAccountName}}:{{item.chatMessage}}</p>
					<p v-if="item.chatImg" class="chat-content">{{item.sendAccountName}}:[ 图片 ]</p>
					<p v-if="item.chatVoice" class="chat-content">{{item.sendAccountName}}:[ 语音 ]</p>

				</div>
				<div class="chat-info" v-else>
					<p class="chat-title" style=" justify-content: space-between;">
						<span>{{item.sendAccountId == $store.state.userInfo._id?item.targetAccountName:item.sendAccountName}}</span>
						<span class="chat-time">{{$moment(item.chatTime).format('HH:mm:ss')}}</span>
					</p>
					<p v-if="item.chatMessage" class="chat-content">{{item.chatMessage}}</p>
					<p v-if="item.chatImg" class="chat-content">[ 图片 ]</p>
					<p v-if="item.chatVoice" class="chat-content">[ 语音 ]</p>

				</div>
				<!-- <div class="chat-time">{{$moment(item.chatTime).format('HH:mm:ss')}}</div> -->

			</van-cell>
		</van-list>
		<van-empty description="暂未聊天消息" v-else />
	</div>
</template>
<script>
	// import moment from "moment";
	import {

		alldigtalChatList,
		getUserInfo,
		getAllgrounpChatList
	} from "../api";

	export default {
		data() {
			return {
				active: 0,
				msg: "",
				chatUserList: [],
				chatUserLists: [],
				socket: null,
				list: [],
				loading: false,
				finished: false,
				refreshing: false,
				userid: "",
				friendIds: [],
				allChatList: [],
				chatRooms: null, //我的群组
			};
		},

		mounted() {
			//this.getUserInfo();

			this.socket = this.$socketio.connect("http://127.0.0.1:3000", {
				transports: ["websocket", "xhr-polling", "jsonp-polling"]
			});
			this.chatRooms = this.$store.state.userInfo.chatRooms
			console.log(this.$store.state.userInfo)
			this.alldigtalChatList();
			if (this.userid) {
				this.socket.emit("online", this.userid);
				this.socket.on("userlist", msg => {
					//  console.log(msg)
					localStorage.setItem("userlistId", JSON.stringify(msg));
					//  console.log(JSON.parse(localStorage.getItem("userlistId")))
				});
			}
			//实时监听在线私聊消息
			this.socket.on("receiveChatMessage", msg => {
				// console.log(msg)
				if (msg) {
			
					if (msg.targetAccountId == this.$store.state.userInfo._id) {
						console.log(msg)
						console.log(this.allChatList)
						let sendAccountAndTargetAccountId = msg.sendAccountId + msg.targetAccountId;
						let targetAccountAndSendAccountId = msg.targetAccountId + msg.sendAccountId
						if (this.allChatList.length > 0) {
							for (let i = 0; i < this.allChatList.length; i++) {
			
								if (sendAccountAndTargetAccountId == this.allChatList[i].sendAccountAndTargetAccountId ||
									targetAccountAndSendAccountId == this.allChatList[i].sendAccountAndTargetAccountId) {
									if (msg.chatMessage) {
										this.allChatList[i].chatVoice = "";
										this.allChatList[i].chatImg = "";
										this.allChatList[i].chatMessage = msg.chatMessage;
									} else if (msg.chatVoice) {
										this.allChatList[i].chatMessage = "";
										this.allChatList[i].chatImg = "";
										this.allChatList[i].chatVoice = msg.chatVoice;
									} else if (msg.chatImg) {
										this.allChatList[i].chatMessage = "";
										this.allChatList[i].chatVoice = "";
										this.allChatList[i].chatImg = msg.chatImg;
									}
									this.allChatList[i].chatTime = msg.chatTime;
								}
								// else if (sendAccountAndTargetAccountId != this.allChatList[i].sendAccountAndTargetAccountId ||
								// 	targetAccountAndSendAccountId != this.allChatList[i].sendAccountAndTargetAccountId) {
								// 	console.log(33)
								// 	this.allChatList.unshift(msg)
								// }
							}
						}
			
					}
				}
			
			});
			//实时监听离线私聊消息
			this.socket.on("receiveOffLineChatMessage", msg => {
				// console.log(msg)
				if (msg) {
			
					if (msg.targetAccountId == this.$store.state.userInfo._id) {
						console.log(msg)
						console.log(this.allChatList)
						let sendAccountAndTargetAccountId = msg.sendAccountId + msg.targetAccountId;
						let targetAccountAndSendAccountId = msg.targetAccountId + msg.sendAccountId
						if (this.allChatList.length > 0) {
							for (let i = 0; i < this.allChatList.length; i++) {
								if (sendAccountAndTargetAccountId == this.allChatList[i].sendAccountAndTargetAccountId ||
									targetAccountAndSendAccountId == this.allChatList[i].sendAccountAndTargetAccountId) {
									if (msg.chatMessage) {
										this.allChatList[i].chatVoice = "";
										this.allChatList[i].chatImg = "";
										this.allChatList[i].chatMessage = msg.chatMessage;
									} else if (msg.chatVoice) {
										this.allChatList[i].chatMessage = "";
										this.allChatList[i].chatImg = "";
										this.allChatList[i].chatVoice = msg.chatVoice;
									} else if (msg.chatImg) {
										this.allChatList[i].chatMessage = "";
										this.allChatList[i].chatVoice = "";
										this.allChatList[i].chatImg = msg.chatImg;
									}
									this.allChatList[i].chatTime = msg.chatTime;
								}
								// else if (sendAccountAndTargetAccountId != this.allChatList[i].sendAccountAndTargetAccountId ||
								// 	targetAccountAndSendAccountId != this.allChatList[i].sendAccountAndTargetAccountId) {
								// 	console.log(33)
								// 	this.allChatList.unshift(msg)
								// }
							}
						}
			
					}
				}
			
			});
			
			//实时监听群聊消息
			this.socket.on("receiveGrounpChatMessage", msg => {
				//console.log(this.$store.state.userInfo)
				if (msg) {
					//判断是不是我的群组
					let isMyChatRoom = this.$store.state.userInfo.chatRooms.findIndex(
						chatRoomId => chatRoomId == msg.chatRoomId
					);
					console.log(isMyChatRoom)
					if (isMyChatRoom !== -1) {
						// console.log(msg)
						for (let i = 0; i < this.allChatList.length; i++) {
							if (this.allChatList[i].chatRoomId) {
								if (this.allChatList[i].chatRoomId == msg.chatRoomId) {
									if (msg.chatMessage) {
										this.allChatList[i].chatVoice = "";
										this.allChatList[i].chatImg = "";
										this.allChatList[i].chatMessage = msg.chatMessage;
									} else if (msg.chatVoice) {
										this.allChatList[i].chatMessage = "";
										this.allChatList[i].chatImg = "";
										this.allChatList[i].chatVoice = msg.chatVoice;
									} else if (msg.chatImg) {
										this.allChatList[i].chatMessage = "";
										this.allChatList[i].chatVoice = "";
										this.allChatList[i].chatImg = msg.chatImg;
									}
									this.allChatList[i].chatTime = msg.chatTime;
									this.allChatList[i].chatRoomName = msg.chatRoomName;
									this.allChatList[i].sendAccountName = msg.sendAccountName;
									this.allChatList[i].chatRoomImg = msg.chatRoomImg;
								}
							}
			
						}
					}
				}
			
			});
		},

		updated() {
			

		},
		methods: {
			async alldigtalChatList() {
				this.userid = localStorage.getItem("vuechatid");
				const result = await alldigtalChatList(this.userid);
				// console.log(11)
				const allgrounpChatListReault = await getAllgrounpChatList(this.userid);
				console.log(allgrounpChatListReault)
				if (allgrounpChatListReault.data.status === 2) {
					var allgrounpChatList = allgrounpChatListReault.data.allGrounpChatList
				}
				let chatDigtalList = result.data.chatDigtalList
				if (chatDigtalList) {
					this.allChatList.push(...chatDigtalList);
				}
				this.allChatList.push(...allgrounpChatList)
				this.allChatList = this.MsgSort(this.allChatList)
			},
			MsgSort(arr) {
				arr.sort((a, b) => {
					let t1 = new Date(a.chatTime)
					let t2 = new Date(b.chatTime)
					return t2.getTime() - t1.getTime()
				})
				return arr
			},

			//跳转到发消息的页面
			async sendMessage(item) {
				console.log(item)
				if (item.chatRoomId) {
					this.$router.push({
						name: "GrounpChatPage",
						query: {
							id: item.chatRoomId
						}
					});
				} else {
					let targetId = item.sendAccountId == this.$store.state.userInfo._id ? item.targetAccountId : item.sendAccountId
					//console.log(userinfo);
					let result = await getUserInfo(targetId);
					let userinfo = result.data.userinfo;
					//console.log(userinfo)
					this.$router.push({
						name: "ChatPage",
						query: {
							userinfo: JSON.stringify(userinfo)
						}
					});
				}

			},
			//JS数组去重，JS根据数组里面的对象属性值去重
			arrayUnique(arr, name) {
				var hash = {};
				return arr.reverse().reduce(function(item, next) {
					//console.log(next)
					hash[next[name]] ? "" : (hash[next[name]] = true && item.push(next));
					return item;
				}, []);
			}
		}
	};
</script>

<style lang="less">
	p {
		margin: 0;
		padding: 0;
	}

	.home {
		margin-bottom: 50px;
	}

	.van-cell__value {
		display: flex;
	}

	.chat-info {
		margin-left: 15px;
		flex: 1;

		.chat-title {
			font-size: 15px;
			display: flex;
		}

		.chat-content {
			color: #999;
			width: 240px;
			    text-overflow: ellipsis;
			    overflow: hidden;
			    white-space: nowrap;
		}
	}

	.chat-time {
		color: #999;
	}
</style>
