<template>
    <div class="wehat-moments">
        <van-nav-bar
            title="朋友圈"
            :fixed="true"
        >
            <template v-slot:right>
                <van-icon
                    name="plus"
                    size="18"
                    @click="goToPublicMoments"
                />
            </template>
        </van-nav-bar>
        <header>
            <!-- <img id="bg" :src="$store.state.userInfo.wechatMomentBg"> -->
            <van-image
                scale-down
                width="100%"
                height="200px"
                :src="$store.state.userInfo.wechatMomentBg || defaultMoment"
            />
            <p
                id="user-name"
                class="data-name"
            >
                {{ $store.state.userInfo.vuechatName }}
            </p>
            <img
                id="avt"
                class="data-avt"
                :src="$store.state.userInfo.vuechatAvatar"
                @click="goMyWechatMoment($store.state.userInfo)"
            >
        </header>

        <div
            v-if="wechatMomentLists.length > 0"
            id="main"
            style=" margin-top: 46px;margin-bottom: 50px; background: #fff"
        >
            <div
                id="list"
                style="padding: 0"
            >
                <ul>
                    <li
                        v-for="(moment, momentIndex) in wechatMomentLists"
                        :key="momentIndex"
                        @click="moment.showComment = showComment = false"
                    >
                        <div class="po-avt-wrap">
                            <img
                                class="po-avt data-avt"
                                :src="moment.vuechatAvatar"
                                @click="goToVuechatInfo(moment.vueChatId)"
                            >
                        </div>

                        <div class="po-cmt">
                            <div class="po-hd">
                                <p class="po-name">
                                    <span class="data-name">{{ moment.vuechatName }}</span>
                                </p>
                                <div class="post">
                                    <p :class="[moment.textlength ? 'moment-text' : '']">
                                        {{ moment.momentText }}
                                    </p>
                                    <p :class="[moment.textlength ? 'moment-img' : '']">
                                        <img
                                            v-for="(imgs, index) in moment.base64ImgList"
                                            :key="index"
                                            class="list-img"
                                            style="height: 80px"
                                            :src="imgs"
                                            @click="previewImg(moment.base64ImgList)"
                                        >
                                    </p>
                                </div>
                                <p
                                    class="post"
                                    style="margin-top: 6px; color: #007faa"
                                    @click="toggleShow(moment)"
                                >
                                    {{ moment.toggleShowText }}
                                </p>
                                <!-- <p class="post" v-else style="margin-top: 6px;color: #007FAA;" @click="toggleShow(moment)">展开</p> -->
                                <div
                                    v-if="moment.location"
                                    class="location"
                                    @click="showLocation(moment.latitudeAndlongitude)"
                                >
                                    <van-icon
                                        name="location-o"
                                        size="14"
                                    />
                                    <span style=" color: #b1b1b1;font-size: 13px">{{ moment.location }}</span>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between">
                                    <p
                                        class="time"
                                        style="font-size: 14px"
                                    >
                                        {{ moment.momentTime }}
                                    </p>
                                    <van-popover
                                        v-model="showPopoverFlag[momentIndex]"
                                        placement="left"
                                        theme="dark"
                                        trigger="click"
                                        style="left: 253px"
                                    >
                                        <van-grid
                                            square
                                            clickable
                                            :border="false"
                                            column-num="2"
                                            style="width: 100px"
                                            icon-size="18"
                                        >
                                            <van-grid-item
                                                v-for="(actionitem, actionindex) in actions"
                                                :key="actionindex"
                                                :icon="actionitem.icon"
                                                @click.stop="clickAction(actionitem, moment, momentIndex)"
                                            />
                                        </van-grid>
                                        <template v-slot:reference>
                                            <van-icon
                                                name="more"
                                                size="24"
                                                @click="showPopoverBox(moment)"
                                            />
                                        </template>
                                    </van-popover>
                                </div>
                            </div>
                            <div
                                v-if="moment.likeAccountNameArr.length > 0 || moment.commentList.length > 0"
                                class="r"
                            />
                            <div class="cmt-wrap">
                                <div
                                    v-if="moment.likeAccountNameArr.length > 0"
                                    class="like"
                                >
                                    <img :src="likePng">
                                    <span
                                        v-for="(likeName, likeIndex) in moment.likeAccountNameArr"
                                        :key="likeIndex"
                                        style="font-size: 14px"
                                    >{{ likeName }}<span>，</span></span>
                                </div>
                                <div
                                    v-if="moment.commentListArr.length > 0"
                                    class="cmt-list"
                                >
                                    <p
                                        v-for="(commemt, commentIndex) in moment.commentListArr"
                                        :key="commentIndex"
                                        @click.stop="replyComment(commemt, moment)"
                                    >
                                        <span><span @click.stop="goToVuechatInfo(commemt.sendCommentId)">{{
                                            commemt.sendVuechatName
                                        }}</span><span v-if="commemt.recieveCommentId"><span style="color: #222">回复</span><span @click.stop="goToVuechatInfo(commemt.recieveCommentId)">{{
                                            commemt.recieveVuechatName
                                        }}</span></span>：</span>{{ commemt.wechatComment }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="moment.showComment && showComment"
                            class="commnet-box"
                            @click.stop=""
                        >
                            <van-field
                                v-model="wechatComment"
                                center
                                clearable
                                placeholder="评论"
                                size="small"
                            >
                                <van-button
                                    size="small"
                                    type="primary"
                                    @click="sendComment(moment)"
                                >
                                    发送
                                </van-button>
                            </van-field>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <van-empty
            v-else
            description="暂无动态"
        />
    </div>
</template>
<script>
import '../assets/css/wechatFriend.css';
import {ImagePreview, Toast} from 'vant';
import {
    getAllFriendsWechatMoments,
    getChatUserInfo,
    likeWechatMoment,
    unLikeWechatMoment,
    sendWechatComment
} from '../api';
export default {
    inject: ['reload'], // 注入App里的reload方法
    data() {
        return {
            bg: require('../assets/images/bg.jpg'),
            cicon: require('../assets/images/c.png'),
            likePng: require('../assets/images/like.png'),
            userid: '',
            wechatMomentLists: [],
            avatarPng: require('../assets/images/bg.jpg'),
            defaultMoment: require('../assets/images/defaultMoment.jpg'),
            showPopover: false,
            // 通过 actions 属性来定义菜单选项
            actions: null,
            wechatComment: '', // 评论内容
            showComment: false,
            recieveCommentId: '', // 艾特评论的人，
            sendCommentId: '', // 评论的人
            showPopoverFlag: []
        };
    },
    async mounted() {
        this.userid = localStorage.getItem('vuechatid');
        await this.$store.dispatch('getMyInfo', this.userid);
        this.getAllWechatMomentList();
        // console.log(this.$store.state.userInfo)
    },
    updated() {
        // console.log(1)
    },
    methods: {
        showPopoverBox(wechatMoments) {
            const likeAccounts = wechatMoments.likeAccounts;
            // 判断用户有没有点赞
            const isLike = likeAccounts.findIndex(id => id === this.userid);
            // console.log(isLike)
            if (isLike !== -1) {
                this.actions = [
                    {
                        icon: 'like',
                        actionkey: 1
                    },
                    {
                        icon: 'chat',
                        actionkey: 2
                    }
                ];
            } else {
                this.actions = [
                    {
                        icon: 'like-o',
                        actionkey: 1
                    },
                    {
                        icon: 'chat',
                        actionkey: 2
                    }
                ];
            }
        },
        async clickAction(action, wechatMoment, momentIndex) {
            if (action.actionkey === 1) {
                const vuechatAccountId = this.$store.state.userInfo._id;
                const wechatMomentInfo = {
                    wechatMomentId: wechatMoment._id,
                    vuechatAccountId: vuechatAccountId
                };
                if (wechatMoment.likeAccounts.length === 0) {
                    const result = await likeWechatMoment(wechatMomentInfo);
                    if (result) {
                        Toast(result.data.message);
                        this.showPopoverFlag[momentIndex] = false;
                        this.getAllWechatMomentList();
                    }
                } else {
                    // 判断当前用户是否点赞了
                    const idx = wechatMoment.likeAccounts.findIndex(id => id === vuechatAccountId); // -1为没有点赞
                    if (idx === -1) {
                        const result = await likeWechatMoment(wechatMomentInfo); // 点赞
                        if (result) {
                            Toast(result.data.message);
                            this.showPopoverFlag[momentIndex] = false;
                            this.getAllWechatMomentList();
                        }
                    } else {
                        const result = await unLikeWechatMoment(wechatMomentInfo); // 取消点赞
                        if (result) {
                            Toast(result.data.message);
                            this.showPopoverFlag[momentIndex] = false;
                            this.getAllWechatMomentList();
                        }
                    }
                }
            } else {
                this.showComment = true;
                wechatMoment.showComment = true;
                this.showPopoverFlag[momentIndex] = false;
            }
        },
        previewImg(imglist) {
            ImagePreview(imglist);
        },
        // 去发表朋友圈的页面
        goToPublicMoments() {
            this.$router.push('/publicmoments');
        },
        goMyWechatMoment(userinfo) {
            this.$router.push({
                name: 'MyWechatMoments',
                query: {
                    userinfo: JSON.stringify(userinfo)
                }
            });
        },
        async getAllWechatMomentList() {
            const result = await getAllFriendsWechatMoments(this.userid); // 获取所有好友的朋友圈

            const allFriendsWechatMoments = this.MsgSort(result.data.allFriendsWechatMoments, 'momentTime');
            let allWechatMomentsLength = allFriendsWechatMoments.length;
            allFriendsWechatMoments.forEach(async wechatMoment => {
                wechatMoment['showComment'] = false;
                if (wechatMoment.momentText.length > 200) {
                    wechatMoment['textlength'] = true;
                    wechatMoment['toggleShowText'] = '展开';
                }
                const vueChatAccount = await getChatUserInfo(wechatMoment.vueChatId);
                wechatMoment['likeAccountNameArr'] = [];
                if (wechatMoment.likeAccounts) {
                    wechatMoment.likeAccounts.forEach(async likeAccount => {
                        const likeAccountName = await getChatUserInfo(likeAccount);
                        wechatMoment['likeAccountNameArr'].push(likeAccountName.data.userinfo.vuechatName);
                    });
                }
                wechatMoment['commentListArr'] = [];
                if (wechatMoment.commentList) {
                    const commentLists = wechatMoment.commentList;
                    commentLists.forEach(async commentList => {
                        // console.log(commentList);
                        const sendCommentResult = await getChatUserInfo(commentList.sendCommentId);
                        const sendCommentUserInfo = sendCommentResult.data.userinfo;
                        commentList['sendVuechatName'] = sendCommentUserInfo.vuechatName;
                        if (commentList.recieveCommentId) {
                            const recieveCommentResult = await getChatUserInfo(commentList.recieveCommentId);
                            const recieveCommentUserInfo = recieveCommentResult.data.userinfo;
                            commentList['recieveVuechatName'] = recieveCommentUserInfo.vuechatName;
                        }
                        wechatMoment['commentListArr'].push(commentList);
                        wechatMoment['commentListArr'] = this.MsgSort1(
                            wechatMoment['commentListArr'],
                            'wechatCommentTime'
                        );
                    });
                }
                wechatMoment['vuechatName'] = vueChatAccount.data.userinfo.vuechatName;
                wechatMoment['vuechatAvatar'] = vueChatAccount.data.userinfo.vuechatAvatar;
                wechatMoment['momentTime'] = this.getTimer(wechatMoment.momentTime);
                allWechatMomentsLength--;
                if (allWechatMomentsLength === 0) {
                    this.wechatMomentLists = allFriendsWechatMoments;
                }
            });
        },
        // 查看用户主页
        async goToVuechatInfo(id) {
            const result = await getChatUserInfo(id);
            const userinfo = result.data.userinfo;
            this.$router.push({
                name: 'ChatUserInfo',
                query: {
                    userinfo: JSON.stringify(userinfo)
                }
            });
        },
        // 传入一个需要排序的数组
        MsgSort(arr, name) {
            arr.sort((a, b) => {
                const t1 = new Date(a[name]);
                const t2 = new Date(b[name]);
                return t2.getTime() - t1.getTime();
            });
            return arr;
        },
        MsgSort1(arr, name) {
            arr.sort((a, b) => {
                const t1 = new Date(a[name]);
                const t2 = new Date(b[name]);
                return t1.getTime() - t2.getTime();
            });
            return arr;
        },
        getTimer(stringTime) {
            const minute = 1000 * 60;
            const hour = minute * 60;
            const day = hour * 24;
            const week = day * 7;
            const month = day * 30;
            const time1 = new Date().getTime(); // 当前的时间戳
            const time2 = Date.parse(new Date(stringTime)); // 指定时间的时间戳
            const time = time1 - time2;

            let result = null;
            if (time < 0) {
                Toast('设置的时间不能早于当前时间！');
            } else if (time / month >= 1) {
                result = `发布于：${  parseInt(time / month)  }月前`;
            } else if (time / week >= 1) {
                result = `发布于：${  parseInt(time / week)  }周前`;
            } else if (time / day >= 1) {
                result = `发布于：${  parseInt(time / day)  }天前`;
            } else if (time / hour >= 1) {
                result = `发布于：${  parseInt(time / hour)  }小时前`;
            } else if (time / minute >= 1) {
                result = `发布于：${  parseInt(time / minute)  }分钟前`;
            } else {
                result = '刚刚';
            }
            return result;
        },
        // 显示朋友圈位置
        showLocation(latitudeAndlongitude) {
            this.$router.push({
                name: 'ShowLocation',
                query: {
                    latitudeAndlongitude: JSON.stringify(latitudeAndlongitude)
                }
            });
        },
        // 评论
        async sendComment(wechatComment) {
            if (this.wechatComment === '') {
                Toast('评论不能为空');
            } else {
                const commentInfo = {
                    wechatMomentId: wechatComment._id,
                    sendCommentId: this.userid,
                    recieveCommentId: this.recieveCommentId,
                    wechatComment: this.wechatComment,
                    wechatCommentTime: new Date()
                };
                const result = await sendWechatComment(commentInfo);
                Toast(result.data.message);
                if (result.data.status === 2) {
                    this.showComment = false;
                    this.wechatComment = '';
                    this.getAllWechatMomentList();
                }
            }
        },
        // 回复评论
        replyComment(comment, moment) {
            if (comment.sendCommentId === this.userid && !comment.recieveCommentId) {
                Toast('请勿自身回复评论');
                this.showComment = false;
            } else {
                this.showComment = true;
                moment.showComment = true;
                this.sendCommentId = this.userid;
                if (this.userid === comment.sendCommentId) {
                    this.recieveCommentId = comment.recieveCommentId;
                } else {
                    this.recieveCommentId = comment.sendCommentId;
                }
            }
        },
        toggleShow(moment) {
            moment.textlength = !moment.textlength;
            if (moment.textlength) {
                moment.toggleShowText = '展开';
            } else {
                moment.toggleShowText = '收起';
            }
        }
    }
};
</script>

<style lang="less">
.van-grid-item__content {
    background-color: #4a4a4a !important;
}

.commnet-box {
    /* width: 100%; */
    position: relative;
    top: 10px;
    padding: 4px;
    display: flex;
    align-items: center;
    background-color: #eee;

    .van-cell {
        padding: 4px 6px !important;
    }
}

.location {
    display: flex;
    align-items: center;
    width: 160px;

    span {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;

        white-space: nowrap;
    }
}
.show-more {
    text-align: center;
    color: #3b5384;
    margin-top: 8px;
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
