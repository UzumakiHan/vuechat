<template>
	<div>
		<van-nav-bar title="我的群组" :fixed="true" style="z-index:99" left-text="返回" left-arrow @click-left="onClickLeft">
			<template #right>
				<van-icon name="add-o" size="18" @click="addChatGrounp" />
			</template>
		</van-nav-bar>
		<van-list v-if="myChatGrounp.length > 0" style="margin-top: 46px;">
			<van-cell v-for="(chatroom,chatindex) in myChatGrounp" :key="chatindex" @click="goToGrounpChatPage(chatroom)">


				<van-image width="50" height="50" :src="chatroom.chatRoomImg" />
				<div class="chat-info">
					<p class="chat-title">{{chatroom.chatRoomName}}</p>

				</div>

			</van-cell>
			<p class="grounp-text">共{{myChatGrounp.length}}个群组</p>
		</van-list>
		<van-empty description="暂无群组" v-else />
	</div>

</template>

<script>

	import axios from 'axios'
	export default {
		data() {
			return {
				myChatGrounp: [],
				userid: "",
				userinfo: null,
			//	chatRooms:null;
			
			}
		},
		async mounted() {
			// this.userid = localStorage.getItem("vuechatid");
			// await this.$store.dispatch("getMyInfo", this.userid);
			// this.userinfo = this.$store.state.userInfo;
			//this.getAllMyChatRoom();
			this.getUserInfo()

		},
		methods: {
			async getUserInfo() {
				this.userid = localStorage.getItem("vuechatid");
				//console.log(this.userid);
				this.userinfo = await this.$store.dispatch("getMyInfo", this.userid);
				// console.log(this.userinfo)
				this.getAllMyChatRoom();
				//console.log(this.$store.state.userInfo.myApplyVuechatFriendsList.length)
			},
			addChatGrounp() {
				
				
				this.$router.push('/selectchatfriends')
			},
			onClickLeft() {
				this.$router.push('/my')
			},
			async getAllMyChatRoom() {
				let chatRoomIdArr = JSON.stringify(this.userinfo.chatRooms);
				// console.log(chatRoomIdArr)
				const formData = new FormData();
				formData.append('chatRoomIdArr', chatRoomIdArr);
				let headers = {
					headers: {
						"Content-Type": "multipart/form-data"
					}
				};
				axios.post("/api/chatroom/myChatRoom", formData, headers).then(res=>{
					// console.log(res)
					if(res.data.status === 2){
						this.myChatGrounp = res.data.allMyChatRoom;
						//console.log(this.myChatGrounp)
						// Toast(res.data.message);
						// this.$router.push('/mychatgrounp')
					}else{
						Toast('获取群组失败');
					}
				}).catch(err=>{
					console.log(err)
				})

			},
			//跳转到群聊
			goToGrounpChatPage(chatRoom){
				// console.log(chatRoom)
				this.$router.push({
					name: "GrounpChatPage",
					query: {
						id: chatRoom._id
					}
				});
			}

		}
	}
</script>

<style lang="less" scoped="scoped">
	.chat-info {
		display: flex;
		align-items: center;


	}

	.grounp-text {
		text-align: center;
		font-size: 15px;
		background-color: #fff;
		color: #969799;
		padding: 10px 0;
	}
</style>
