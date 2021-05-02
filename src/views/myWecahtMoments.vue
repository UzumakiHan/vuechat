<template>
	<div class="wehat-moments" >
		<van-nav-bar :title="userinfo.vuechatName" :fixed="true" left-text="返回" left-arrow @click-left="onClickLeft">
			<!-- <template #left>
				<van-icon name="plus" size="18" @click="goToPublicMoments" />
			</template> -->
		</van-nav-bar>
		<header style="position: relative;">
			<van-image scale-down width="100%" height="200px" :src="userinfo.wechatMomentBg || defaultMoment" />
			<p id="user-name" class="data-name">{{userinfo.vuechatName}}</p>
			<img id="avt" class="data-avt" :src="userinfo.vuechatAvatar">
			<div class="his-switch-part" @click="goToChangeBgPage" v-if="userid ==userinfo._id ">
				<van-icon :name="switchPng" size="16" />
				<span style="font-size: 13px;margin-left: 4px;">更改背景</span>
			</div>
		</header>
		<div id="main" style="margin-top:46px;background:#fff;" v-if="wechatMomentLists.length > 0">
			<div id="list" style="padding: 0;">
				<ul>
					<li v-for="(moment,momentIndex) in wechatMomentLists" :key="momentIndex"  @click="moment.showComment=showComment=false">
						<div class="po-avt-wrap">
							<img class="po-avt data-avt" :src="moment.vuechatAvatar">
						</div>

						<div class="po-cmt">
							<div class="po-hd">
								<p class="po-name"><span class="data-name">{{moment.vuechatName}}</span></p>
								<div class="post">
									<p :class="[moment.textlength?'moment-text':'']">{{moment.momentText}}</p>
									<p :class="[moment.textlength?'moment-img':'']">
										<img class="list-img" style="height: 80px;" v-for="(imgs,index) in moment.base64ImgList" :key="index" :src="imgs"
										 @click="previewImg(moment.base64ImgList)">
									</p>
								</div>
								<p class="post" style="margin-top: 6px;color: #007FAA;" @click="toggleShow(moment)">{{moment.toggleShowText}}</p>
								<!-- 	<p class="post">展开</p> -->
								<div class="location" v-if="moment.location" @click="showLocation(moment.latitudeAndlongitude)">
									<van-icon name="location-o" size="14" />
									<span style="font-size: 13px;color: #b1b1b1;">{{moment.location}}</span>
								</div>
								<div style="display: flex;align-items: center;justify-content: space-between;">
									<div>
										<p class="time" style="display: flex;align-items: center;">{{moment.momentTime}}
											<van-icon name="delete-o" size="18" style="margin-left: 20px;" v-if="userid ==moment.vueChatId " @click="delWechatMoment(moment._id)" />
										</p>

										<!-- <img class="c-icon" :src="delPng"></p> -->
										<!-- 	<img class="c-icon" :src="cicon"> -->
									</div>
									<van-popover placement="left" v-model="showPopoverFlag[momentIndex]" theme="dark" trigger="click" style="left: 253px;">
										<van-grid square clickable :border="false" column-num="2" style="width: 100px;" icon-size="18">
											<van-grid-item v-for="(actionitem,actionindex) in actions" :key="actionindex" :icon="actionitem.icon" @click="clickAction(actionitem,moment,momentIndex)" />
										</van-grid>
										<template #reference>
											<van-icon name="more" @click="showPopoverBox(moment)" size="24" />
										</template>
									</van-popover>
								</div>


							</div>
							<div class="r" v-if="moment.likeAccountNameArr.length>0 || moment.commentList.length>0"></div>
							<div class="cmt-wrap">
								<div class="like" v-if="moment.likeAccountNameArr.length>0">
									<img :src="likePng">
									<span style="font-size: 14px;" v-for="(likeName,likeIndex) in moment.likeAccountNameArr" :key="likeIndex">{{likeName}}<span>，</span></span>

								</div>
								<div class="cmt-list" v-if="moment.commentListArr.length>0">
									<p v-for="(commemt,commentIndex) in moment.commentListArr" :key="commentIndex" @click.stop="replyComment(commemt,moment)">
										<span><span @click.stop="goToVuechatInfo(commemt.sendCommentId)">{{commemt.sendVuechatName}}</span><span v-if="commemt.recieveCommentId"><span
												 style="color: #222;">回复</span><span @click.stop="goToVuechatInfo(commemt.recieveCommentId)">{{commemt.recieveVuechatName}}</span></span>：</span>{{commemt.wechatComment}}</p>

								</div>
							</div>
						</div>
						<div class="commnet-box" v-if="moment.showComment && showComment" @click.stop="">
							<van-field v-model="wechatComment" center clearable placeholder="评论" size="small">
								<van-button slot="button" size="small" type="primary" @click="sendComment(moment)">发送</van-button>
							</van-field>
						</div>
					</li>


				</ul>
			</div>
		</div>
		<van-empty description="暂无动态" v-else />
		<p v-if="nomore" class="showmore">{{loadtext}}</p>
	</div>
</template>
<script>
	import '../assets/css/wechatFriend.css';
	import {
		ImagePreview,
		Toast,
		Dialog
	} from 'vant';
	import {
		getAllWechatMoments,
		getChatUserInfo,
		getMyWechatMoments,
		delWechatMoment,
		likeWechatMoment,
		unLikeWechatMoment,
		sendWechatComment
	} from '../api'
	export default {
		inject:['reload'],
		data() {
			return {
				bg: require('../assets/images/bg.jpg'),
				cicon: require('../assets/images/c.png'),
				likePng: require('../assets/images/like.png'),
				delPng: require('../assets/images/delete.png'),
				userid: "",
				wechatMomentLists: [],
				avatarPng: require('../assets/images/bg.jpg'),
				switchPng: require('../assets/images/switchbg.png'),
				userinfo: "",
				defaultMoment: require('../assets/images/defaultMoment.jpg'),
				actions: [{
					icon: 'like-o',
					'actionkey': 1
				}, {
					icon: 'chat',
					'actionkey': 2
				}],
				showPopover: false,
				wechatComment: "", //评论内容
				showComment: false,
				recieveCommentId: "", //艾特评论的人，
				sendCommentId: '', //评论的人
				showPopoverFlag: [],
				pageSize: 5,
				pageNum: 1,
				pages: 0,
				nomore: false,
				loadtext: ''
			}
		},
		mounted() {
			this.userid = localStorage.getItem("vuechatid");
			this.userinfo = JSON.parse(this.$route.query.userinfo);
			//console.log(this.userinfo)
			this.getMyWechatMomentList(this.pageSize, this.pageNum);

		},
		created() {
			var _this = this;
			window.addEventListener('scroll', function() {
				var scr = document.documentElement.scrollTop || document.body.scrollTop; // 向上滚动的那一部分高度
				var clientHeight = document.documentElement.clientHeight; // 屏幕高度也就是当前设备静态下你所看到的视觉高度
				var scrHeight = document.documentElement.scrollHeight || document.body.scrollHeight; // 整个网页的实际高度，兼容Pc端
				if (scr + clientHeight + 10 >= scrHeight) {
					// console.log(_this.pageNum,_this.pages);
					if (_this.pageNum == _this.pages) {
						_this.nomore = true;
						_this.loadtext = '没有更多了.....'

					} else {
						// _this.nomore = true
						_this.pageNum = _this.pageNum + 1
						_this.getMyWechatMomentList(_this.pageSize, _this.pageNum);
						// _this.nomore = false
					}
				}
			});
		},
		methods: {
			showPopoverBox(WechatMoment) {
				//this.showPopover = t;
				// console.log(this.showPopoverFlag);
				let likeAccounts = WechatMoment.likeAccounts;
				//判断用户有没有点赞
				let isLike = likeAccounts.findIndex(id => id == this.userid);
				// console.log(isLike)
				if (isLike !== -1) {
					this.actions = [{
						icon: 'like',
						'actionkey': 1
					}, {
						icon: 'chat',
						'actionkey': 2
					}]
				} else {
					this.actions = [{
						icon: 'like-o',
						'actionkey': 1
					}, {
						icon: 'chat',
						'actionkey': 2
					}]
				}
			},
			async clickAction(action, wechatMoment, momentIndex) {
				//this.showPopover = false;
				// console.log(action,wechatMoment)
				if (action.actionkey === 1) {
					let vuechatAccountId = this.$store.state.userInfo._id;
					//console.log(wechatMoment)
					let wechatMomentInfo = {
						wechatMomentId: wechatMoment._id,
						vuechatAccountId: vuechatAccountId
					}
					if (wechatMoment.likeAccounts.length === 0) {

						const result = await likeWechatMoment(wechatMomentInfo);
						if (result) {
							Toast(result.data.message)
							this.showPopoverFlag[momentIndex] = false;
							this.reload()
								// this.getMyWechatMomentList(this.pageSize, this.pageNum);
							// wechatMoment.likeAccounts.push(vuechatAccountId)
							// console.log(wechatMoment.likeAccounts)
						}

					} else {
						//判断当前用户是否点赞了
						let idx = wechatMoment.likeAccounts.findIndex(id => id == vuechatAccountId); // -1为没有点赞
						if (idx === -1) {
							const result = await likeWechatMoment(wechatMomentInfo); // 点赞
							Toast(result.data.message)
							if (result) {
								Toast(result.data.message)
								this.showPopoverFlag[momentIndex] = false
								this.reload()
									// this.getMyWechatMomentList(this.pageSize, this.pageNum);
								//wechatMoment.likeAccounts.push(vuechatAccountId)
							}
						} else {
							const result = await unLikeWechatMoment(wechatMomentInfo); // 取消点赞
							//Toast('你已经点赞了')
							if (result) {
								Toast(result.data.message)
								this.showPopoverFlag[momentIndex] = false
								this.reload()
								// await this.getMyWechatMomentList(this.pageSize, this.pageNum);
								// console.log(idx)

								//wechatMoment.likeAccounts.splice(idx, 1)
							}

						}

					}
				} else {
					this.showComment = true
					wechatMoment.showComment = true;
					this.showPopoverFlag[momentIndex] = false
				}

				// console.log(userinfo)
				// Toast(action.actionkey);
			},
			previewImg(imglist) {
				ImagePreview(imglist)
			},
			async getMyWechatMomentList(pageSize, pageNum) {
				console.log(11)
				let getInfo = {
					id: this.userinfo._id,
					pageSize: pageSize,
					pageNum: pageNum
				}
				const myWechatMoment = await getMyWechatMoments(getInfo)
				// console.log(myWechatMoment)
				let myWechatMomentList = myWechatMoment.data.myWechatMoments.list;
				this.pages = myWechatMoment.data.myWechatMoments.pages
				let myWechatMomentListLength = myWechatMomentList.length;
				// console.log(this.pages)
				// let allWechatMoments = this.userinfo.wechatMomentList;
				myWechatMomentList.forEach(async wechatMoment => {
					wechatMoment['showComment'] = false
					if (wechatMoment.momentText.length > 200) {
						wechatMoment['textlength'] = true;
						wechatMoment['toggleShowText'] = '展开'
					}
					let vueChatAccount = await getChatUserInfo(this.userinfo._id);
					wechatMoment['likeAccountNameArr'] = [];
					if (wechatMoment.likeAccounts) {
						wechatMoment.likeAccounts.forEach(async likeAccount => {
							let likeAccountName = await getChatUserInfo(likeAccount);
							//console.log(likeAccountName)
							wechatMoment['likeAccountNameArr'].push(likeAccountName.data.userinfo.vuechatName)
						})
					}
					wechatMoment['commentListArr'] = [];
					if (wechatMoment.commentList) {
						let commentLists = wechatMoment.commentList;
						commentLists.forEach(async commentList => {
							// console.log(commentList);
							let sendCommentResult = await getChatUserInfo(commentList.sendCommentId);
							let sendCommentUserInfo = sendCommentResult.data.userinfo;
							// console.log(sendCommentUserInfo);
							commentList['sendVuechatName'] = sendCommentUserInfo.vuechatName;
							if (commentList.recieveCommentId) {
								let recieveCommentResult = await getChatUserInfo(commentList.recieveCommentId);
								let recieveCommentUserInfo = recieveCommentResult.data.userinfo;
								commentList['recieveVuechatName'] = recieveCommentUserInfo.vuechatName;
							}
							wechatMoment['commentListArr'].push(commentList)
							wechatMoment['commentListArr'] = this.MsgSort1(wechatMoment['commentListArr'], 'wechatCommentTime')
						});


					}
					wechatMoment['vuechatName'] = vueChatAccount.data.userinfo.vuechatName;
					wechatMoment['vuechatAvatar'] = vueChatAccount.data.userinfo.vuechatAvatar;
					wechatMoment['momentTime'] = this.getTimer(wechatMoment.momentTime);
					this.wechatMomentLists.push(wechatMoment)

				})
			},
			getTimer(stringTime) {
				let minute = 1000 * 60;
				let hour = minute * 60;
				let day = hour * 24;
				let week = day * 7;
				let month = day * 30;
				let time1 = new Date().getTime(); //当前的时间戳
				//  console.log(time1);
				let time2 = Date.parse(new Date(stringTime)); //指定时间的时间戳
				//  console.log(time2);
				let time = time1 - time2;

				let result = null;
				if (time < 0) {
					alert("设置的时间不能早于当前时间！");
				} else if (time / month >= 1) {
					result = "发布于：" + parseInt(time / month) + "月前";
				} else if (time / week >= 1) {
					result = "发布于：" + parseInt(time / week) + "周前";
				} else if (time / day >= 1) {
					result = "发布于：" + parseInt(time / day) + "天前";
				} else if (time / hour >= 1) {
					result = "发布于：" + parseInt(time / hour) + "小时前";
				} else if (time / minute >= 1) {
					result = "发布于：" + parseInt(time / minute) + "分钟前";
				} else {
					result = "刚刚";
				}
				return result;
			},
			onClickLeft() {
				this.$router.go(-1)
			},
			//删除博客
			async delWechatMoment(id) {
				//console.log(id)
				Dialog.confirm({
						message: "确定删除吗？"
					})
					.then(async () => {
						const result = await delWechatMoment(id);
						if (result.data.status === 2) {
							Toast(result.data.message)
							// await this.getMyWechatMomentList(this.pageSize, this.pageNum);
							this.reload()
						} else {
							Toast(result.data.message)
						}
					})
					.catch(() => {
						// on cancel
					});

			},
			//去更改背景图片的页面
			goToChangeBgPage() {
				this.$router.push('/changemomentbg')
			},
			//显示朋友圈位置
			showLocation(latitudeAndlongitude) {
				this.$router.push({
					name: "ShowLocation",
					query: {
						latitudeAndlongitude: JSON.stringify(latitudeAndlongitude)
					}
				});
			},
			//评论
			async sendComment(wechatComment) {
				//console.log(wechatComment);
				if (this.wechatComment == '') {
					Toast('评论不能为空')
				} else {
					let commentInfo = {
						wechatMomentId: wechatComment._id,
						sendCommentId: this.userid,
						recieveCommentId: this.recieveCommentId,
						wechatComment: this.wechatComment,
						wechatCommentTime: new Date()
					};
					//console.log(commentInfo)
					const result = await sendWechatComment(commentInfo);
					if (result.data.status === 2) {
						this.showComment = false;
						this.wechatComment = '';
						Toast(result.data.message);
						// await this.getMyWechatMomentList(this.pageSize, this.pageNum);
						this.reload()
					} else {
						Toast(result.data.message)
					}
				}
			},
			//回复评论
			replyComment(comment,moment) {
				// this.showComment = true;
				//console.log(comment)
				if (comment.sendCommentId == this.userid && !comment.recieveCommentId) {
					Toast('请勿自身回复评论')
					this.showComment = false;
				} else {
					this.showComment = true;
					moment.showComment = true
					this.sendCommentId = this.userid;
					if (this.userid == comment.sendCommentId) {
						this.recieveCommentId = comment.recieveCommentId
					} else {
						this.recieveCommentId = comment.sendCommentId
					}

				}

			},
			MsgSort1(arr, name) {
				arr.sort((a, b) => {
					let t1 = new Date(a[name])
					let t2 = new Date(b[name])
					return t1.getTime() - t2.getTime()
				})
				return arr
			},
			toggleShow(moment) {
				moment.textlength = !moment.textlength
				if (moment.textlength) {
					moment.toggleShowText = '展开';
				} else {
					moment.toggleShowText = '收起';
				}
			},
			//查看用户主页
			async goToVuechatInfo(id) {
				const result = await getChatUserInfo(id);
				let userinfo = result.data.userinfo;
				this.$router.push({
					name: "ChatUserInfo",
					query: {
						userinfo: JSON.stringify(userinfo)
					}
				});
				//console.log(result)
			},
		}

	}
</script>

<style lang="less" scoped>
	.his-switch-part {
		width: 84px;
		height: 24px;
		background-color: rgb(0, 0, 0);
		opacity: .6;
		display: flex;
		align-items: center;
		border-radius: 15px;
		padding-left: 8px;
		position: absolute;
		top: 8px;
		right: 16px;
		color: #fff;
	}

	.van-grid-item__content {
		background-color: #4a4a4a !important;
	}

	.location {
		display: flex;
		align-items: center;
		width: 160px;

		span {
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;

			white-space: nowrap
		}

	}

	.showmore {
		background-color: #fff;
		text-align: center;
		padding: 4px 0;
		font-size: 14px;
		color: #b1b1b1;
	}

	.moment-img {
		display: none;
	}

	.moment-text {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 5;
		line-clamp: 5;
		-webkit-box-orient: vertical;
	}
</style>
