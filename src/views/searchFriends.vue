<template>
	<div>
		<van-nav-bar :title="title" :fixed="true" left-text="返回" left-arrow @click-left="onClickLeft" />
		<div class="search-box">
			<van-field v-model="searchVal" left-icon="search" placeholder="请输入vuechat号搜索" style="flex:1" />
			<van-button type="info" size="mini" @click="searchFriends">查找</van-button>
		</div>
		<van-empty description="该用户不存在" v-if="noSearch" />
		<ul class="search-list" v-if="hasSearch">
			<li class="search-item" v-for="(item,index) in searchList" :key="index" @click="goToUserDetail(item)">
				<van-image width="60" height="60" :src="item.vuechatAvatar" />
				<div class="userinfo">
					<p>
						<span>vuechat号：</span>
						<span>{{item.vuechatAccount}}</span>
					</p>
					<p>
						<span>vuechat昵称：</span>
						<span>{{item.vuechatName}}</span>
					</p>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
	import {
		searchVueChatAccount,
		searchMyFriend
	} from '../api'
	export default {
		data() {
			return {
				searchVal: "",
				noSearch: false,
				hasSearch: false,
				searchList: [],
				title:'',
				searchKey:0,
				userid:""
			};
		},
		mounted() {
			let keyInfo = JSON.parse(this.$route.query.keyInfo);
			this.title = keyInfo.title;
			this.searchKey = keyInfo.searchKey;
			this.userid = localStorage.getItem("vuechatid");
			// console.log(this.title,this.searchKey)
			
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1)
			},
			async searchFriends() {
				
				this.searchList = []
				this.hasSearch = this.noSearch = false;
				if(this.searchKey === 1){
					let userInfo = {
						vuechatAccount: this.searchVal
					}
					// console.log(userInfo);
					const result = await searchVueChatAccount(userInfo);
					if (result.data.status === 2) {
						this.hasSearch = true;
						this.searchList.push(result.data.userInfo)
					} else {
						this.noSearch = true;
					}
				}else{
					let userInfo = {
						vuechatAccount: this.searchVal,
						id:this.userid
					}
					// console.log(userInfo);
					const result = await searchMyFriend(userInfo);
					 // console.log(result)
					 if (result.data.searchFlag === true) {
					 	this.hasSearch = true;
					 	this.searchList.push(result.data.userInfo)
					 } else {
					 	this.noSearch = true;
					 }
				}
				
				// console.log(result)
				// if (result.data.status === 2) {
				// 	this.hasSearch = true;
				// 	this.searchList.push(result.data.userInfo)
				// } else {
				// 	this.noSearch = true;
				// }
			},
			goToUserDetail(userinfo) {
				console.log(userinfo)
				this.$router.push({
					name: "ChatUserInfo",
					query: {
						userinfo: JSON.stringify(userinfo)
					}
				});
			}
		}
	};
</script>
<style lang="less" scoped>
	.search-box {
		margin-top: 46px;

		display: flex;
		align-items: center;
		background: #fff;
		padding-right: 10px;

	}

	.search-list {
		background: #fff;
		margin-top: 10px;

		.search-item {
			display: flex;
			align-items: center;
			padding: 8px 6px 8px 6px;
			border-bottom: 1px solid #eee;

			&:last-of-type {
				border: none;
			}

			.userinfo {
				margin-left: 10px;

				span {
					font-size: 15px;
				}
			}
		}
	}
</style>
