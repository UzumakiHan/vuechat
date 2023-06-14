<template>
    <div @click="faceShow = false">
        <van-nav-bar
            :title="userinfo.vuechatName"
            :fixed="true"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        >
            <template v-slot:right>
                <van-icon
                    name="more"
                    size="18"
                    @click="checkVueChatAccount"
                />
            </template>
        </van-nav-bar>
        <div
            v-if="chatRecordList.length > 0"
            id="chatbox"
            ref="chatbox"
            class="chat-content"
        >
            <template v-for="(chatAccountItem, chatAccountIndex) in chatRecordList">
                <div
                    v-if="chatAccountItem.sendAccountId === sendUserInfo._id"
                    :key="chatAccountIndex"
                    class="chat-receiver"
                >
                    <div @click="checkUserInfo(sendUserInfo)">
                        <img :src="sendUserInfo.vuechatAvatar">
                    </div>
                    <div>{{ sendUserInfo.vuechatName }}</div>
                    <div v-if="chatAccountItem.chatMessage">
                        <div class="chat-right_triangle" />
                        <span>{{ chatAccountItem.chatMessage }}</span>
                    </div>
                    <div v-if="chatAccountItem.chatVoice.chatVoiceUrl">
                        <div class="chat-right_triangle" />
                        <div
                            class="chat-voice"
                            style="
display: flex;
align-items: center;
padding: 0;
margin: 0;
color: #222;
font-size: 14px;
text-align: left;
                            "
                            @click="playChatVoice(chatAccountItem.chatVoice.chatVoiceUrl)"
                        >
                            <van-icon
                                :name="voice"
                                size
                                @click="recordingVoice"
                            />
                            <span style="margin-left: 6px">{{ chatAccountItem.chatVoice.chatVoiceTime }}s</span>
                        </div>
                    </div>
                    <div
                        v-if="chatAccountItem.chatImg"
                        id="chat-img"
                    >
                        <!-- <div class="chat-right_triangle"></div> -->
                        <van-image
                            :src="chatAccountItem.chatImg"
                            @click="previewImg(chatAccountItem.chatImg)"
                        />
                        <!-- <span>{{chatAccountItem[userinfo.vuechatAccount].chatMessage}}</span> -->
                    </div>
                    <div class="chat-notice">
                        <span>{{ $moment(chatAccountItem.chatTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                    </div>
                </div>

                <!-- Right -->
                <div
                    v-if="chatAccountItem.targetAccountId === sendUserInfo._id"
                    :key="'info2-' + chatAccountIndex"
                    class="chat-sender"
                >
                    <div @click="checkUserInfo(userinfo)">
                        <img :src="userinfo.vuechatAvatar">
                    </div>
                    <div>{{ userinfo.vuechatName }}</div>
                    <div v-if="chatAccountItem.chatMessage">
                        <div class="chat-left_triangle" />
                        <span>{{ chatAccountItem.chatMessage }}</span>
                    </div>
                    <div v-if="chatAccountItem.chatVoice.chatVoiceUrl">
                        <div class="chat-left_triangle" />
                        <div
                            class="chat-voice"
                            style="
display: flex;
align-items: center;
padding: 0;
margin: 0;
color: #222;
font-size: 14px;
text-align: left;
                            "
                            @click="playChatVoice(chatAccountItem.chatVoice.chatVoiceUrl)"
                        >
                            <van-icon
                                :name="voice"
                                size
                                @click="recordingVoice"
                            />
                            <span style="margin-left: 16px">{{ chatAccountItem.chatVoice.chatVoiceTime }}s</span>
                        </div>
                    </div>
                    <div
                        v-if="chatAccountItem.chatImg"
                        id="chat-img"
                    >
                        <!-- <div class="chat-right_triangle"></div> -->
                        <van-image
                            :src="chatAccountItem.chatImg"
                            @click="previewImg(chatAccountItem.chatImg)"
                        />
                        <!-- <span>{{chatAccountItem[userinfo.vuechatAccount].chatMessage}}</span> -->
                    </div>
                    <div class="chat-notice">
                        <span>{{ $moment(chatAccountItem.chatTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                    </div>
                </div>
            </template>
        </div>
        <!-- 表情区域部分 -->
        <ul
            v-show="faceShow"
            class="facelist"
        >
            <li
                v-for="(item, index) in faceList"
                :key="index"
                @click.stop="getBrow(index)"
            >
                {{ item }}
            </li>
        </ul>

        <div class="send-box">
            <div
                class="voice-box"
                @click="showVoiceBlock"
            >
                <van-icon
                    v-if="voiceKeyBoardFlag"
                    :name="voice"
                    size="24"
                />
                <van-icon
                    v-else
                    :name="keyboard"
                    size="24"
                />
            </div>
            <div class="input-box">
                <van-field
                    v-if="voiceKeyBoardFlag"
                    ref="sendinput"
                    v-model="chatMsg"
                    class="vue-input"
                    @keyup.enter="sendChatMsg"
                />
                <van-button
                    v-else
                    type="default"
                    class="voice-btn"
                >
                    <van-icon
                        :name="recordvoice"
                        size="24"
                        @click="recordingVoice"
                    />
                    <van-icon
                        :name="sendvoice"
                        size="24"
                        style="margin-left: 40px"
                        @click="sendVoice"
                    />
                </van-button>
            </div>
            <div class="other-box">
                <van-icon
                    name="smile-o"
                    style="margin-right: 5px"
                    size="24"
                    @click.stop="faceContent"
                />
                <van-uploader
                    v-model="fileList"
                    :after-read="uploadImg"
                >
                    <van-icon
                        name="plus"
                        size="24"
                    />
                </van-uploader>
            </div>
        </div>
    </div>
</template>
<script>
import '../assets/css/chatpage.css';
import {getDigtalChatMsg} from '../api';
import {Toast, ImagePreview} from 'vant';
import axios from 'axios';
import Recorderx, {ENCODE_TYPE} from 'recorderx';
const rc = new Recorderx();
const emojData = require('@/assets/emojis.json');
export default {
    data() {
        return {
            avatar: require('../assets/images/avatar.jpg'),
            keyboard: require('../assets/images/keyboard.png'),
            voice: require('../assets/images/voice-circle.png'),
            recordvoice: require('../assets/images/voice.png'),
            sendvoice: require('../assets/images/send.png'),
            voiceKeyBoardFlag: true, // 语音键盘切换
            chatMsg: '', // 聊天文本
            userinfo: {}, // 当前聊天用户的资料
            userid: '', // 用户id
            sendUserInfo: {},
            chatRecordList: [], // 聊天记录
            onlineUserList: [], // 在线用户
            faceList: [], // 表情数组
            faceShow: false,
            fileList: [], // 图片
            timeOutEvent: 0,
            startime: 0,
            endtime: 0,
            friendsList: null
        };
    },
    mounted() {
        this.userinfo = JSON.parse(this.$route.query.userinfo);
        this.userid = localStorage.getItem('vuechatid');
        this.friendsList = this.$store.state.userInfo.friendsList;
        this.sendUserInfo = this.$store.state.userInfo;
        this.socket = this.$socketio.connect(this.$socketHost, {
            transports: ['websocket', 'xhr-polling', 'jsonp-polling']
        });
        this.socket.on('receiveChatMessage', msg => {
            this.chatRecordList.push(msg);
            this.scrollToButtom();
        });
        this.socket.on('receiveOffLineChatMessage', msg => {
            this.chatRecordList.push(msg);
            this.scrollToButtom();
        });

        this.getDigtalChatMsgDetail();
        this.socket.emit('online', this.userid);
        this.socket.on('userlist', msg => {
            localStorage.setItem('userlistId', JSON.stringify(msg));
        });
    },
    methods: {
        onmousedown() {
            rc.start()
                .then(() => {
                    console.log('start recording');
                })
                .catch(error => {
                    console.log('Recording failed.', error);
                });
        },
        onmouseup() {
            this.statusaudio = true;
            rc.pause();
        },

        onClickLeft() {
            this.$router.go(-1);
        },
        // 查看资料
        checkVueChatAccount() {
            this.$router.push({
                name: 'ChatUserInfo',
                query: {
                    userinfo: JSON.stringify(this.userinfo)
                }
            });
        },
        // 发送聊天信息
        async sendChatMsg() {
            const isFriend = this.friendsList.findIndex(id => id === this.userinfo._id);
            if (isFriend === -1) {
                Toast('对方不是你的好友。');
            } else {
                if (this.chatMsg.trim() === '') {
                    Toast('发送不能为空');
                } else {
                    this.onlineUserList = JSON.parse(localStorage.getItem('userlistId'));
                    const idx = this.onlineUserList.findIndex(item => item === this.userinfo._id); // 1:在线，0不在线
                    // console.log(this.userid);
                    const commonMsgInfo = {
                        sendAccountId: this.userid,
                        targetAccountId: this.userinfo._id,
                        chatMessage: this.chatMsg,
                        chatImg: '',
                        chatTime: new Date(),
                        chatVoice: '',
                        targetAccountAvatar: this.userinfo.vuechatAvatar,
                        sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
                        targetAccountName: this.userinfo.vuechatName,
                        sendAccountName: this.sendUserInfo.vuechatName
                    };
                    const sendChatMsgInfo = {
                        ...commonMsgInfo,
                        sendAccountAndTargetAccountId: this.userid + this.userinfo._id
                    };
                    const targetChatMsgInfo = {
                        ...commonMsgInfo,
                        sendAccountAndTargetAccountId: this.userinfo._id + this.userid
                    };
                    const chatInfoArr = [sendChatMsgInfo, targetChatMsgInfo];

                    if (idx === -1) {
                        this.socket.emit('sendOffLineChatMessage', chatInfoArr);
                    } else {
                        this.socket.emit('sendChatMessage', chatInfoArr);
                    }
                    this.chatMsg = '';
                }
            }
        },

        // 获取聊天内容
        async getDigtalChatMsgDetail() {
            const chatMsgInfo = {
                targetAccountId: this.userinfo._id,
                sendAccountId: this.userid
            };
            const result = await getDigtalChatMsg(chatMsgInfo);
            this.chatRecordList = this.MsgSort(result.data.chatDigtalList);
            this.scrollToButtom();
        },
        // 查看用户资料
        checkUserInfo(userinfo) {
            this.$router.push({
                name: 'ChatUserInfo',
                query: {
                    userinfo: JSON.stringify(userinfo)
                }
            });
        },
        // 获取所有表情
        faceContent() {
            this.faceShow = !this.faceShow;
            this.faceList = [];
            this.$refs.sendinput.foucs();
            if (this.faceShow === true) {
                for (const i in emojData) {
                    this.faceList.push(emojData[i].char);
                }
            }
        },
        // 表情评论
        getBrow(index) {
            for (const i in this.faceList) {
                if (index === i) {
                    this.chatMsg += this.faceList[index];
                }
            }
        },
        async uploadImg(file) {
            this.fileList = [];
            this.onlineUserList = JSON.parse(localStorage.getItem('userlistId'));
            const isFriend = this.friendsList.findIndex(id => id === this.userinfo._id);
            if (isFriend === -1) {
                Toast('对方不是你的好友。');
            } else {
                const idx = this.onlineUserList.findIndex(item => item === this.userinfo._id); // -1不在线
                // console.log(idx);
                const commonMsgInfo = {
                    sendAccountId: this.userid,
                    targetAccountId: this.userinfo._id,
                    chatMessage: '',
                    chatImg: file.content,
                    chatTime: new Date(),
                    chatVoice: '',
                    targetAccountAvatar: this.userinfo.vuechatAvatar,
                    sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
                    targetAccountName: this.userinfo.vuechatName,
                    sendAccountName: this.sendUserInfo.vuechatName
                };
                const sendChatMsgInfo = {
                    ...commonMsgInfo,
                    sendAccountAndTargetAccountId: this.userid + this.userinfo._id
                };
                const targetChatMsgInfo = {
                    ...commonMsgInfo,
                    sendAccountAndTargetAccountId: this.userinfo._id + this.userid
                };
                const chatInfoArr = [sendChatMsgInfo, targetChatMsgInfo];

                if (idx === -1) {
                    // console.log(chatMsgInfo);

                    this.socket.emit('sendOffLineChatMessage', chatInfoArr);
                } else {
                    // console.log(chatMsgInfo);
                    this.socket.emit('sendChatMessage', chatInfoArr);
                }
            }
        },
        previewImg(img) {
            // console.log(img)
            const imglist = [];
            imglist.push(img);
            ImagePreview(imglist);
        },
        // 显示语音录制区域
        showVoiceBlock() {
            rc.clear();
            this.voiceKeyBoardFlag = !this.voiceKeyBoardFlag;
        },

        // 录制语音
        recordingVoice() {
            // that.news_img = !that.news_img
            rc.start()
                .then(() => {
                    this.startime = new Date();
                })
                .catch(() => {
                    console.log('获取麦克风失败');
                });
        },
        // 发送语音
        sendVoice() {
            rc.pause();
            this.endtime = new Date();
            const wav = rc.getRecord({
                encodeTo: ENCODE_TYPE.WAV,
                compressible: true
            });
            const voiceTime = Math.ceil((this.endtime - this.startime) / 1000);
            const formData = new FormData();
            formData.append('chatVoice', wav, `${Date.parse(new Date())}.wav`);
            formData.append('voiceTime', voiceTime);
            const headers = {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'multipart/form-data'
                }
            };
            const isFriend = this.friendsList.findIndex(id => id === this.userinfo._id);
            if (isFriend === -1) {
                Toast('对方不是你的好友。');
            } else {
                const uploadChatVoiceApi =
                    process.env.NODE_ENV === 'development'
                        ? '/api/chatlist/uploadChatVoice'
                        : '/chatlist/uploadChatVoice';
                axios.post(uploadChatVoiceApi, formData, headers).then(res => {
                    if (res.data.status === 2) {
                        rc.clear();
                        const chatVoiceMsg = res.data.chatVoiceMsg;
                        this.onlineUserList = JSON.parse(localStorage.getItem('userlistId'));
                        const idx = this.onlineUserList.findIndex(item => item === this.userinfo._id); // 1:在线，0不在线
                        const commonMsgInfo = {
                            sendAccountId: this.userid,
                            targetAccountId: this.userinfo._id,
                            chatMessage: '',
                            chatImg: '',
                            chatTime: new Date(),
                            chatVoice: chatVoiceMsg,
                            targetAccountAvatar: this.userinfo.vuechatAvatar,
                            sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
                            targetAccountName: this.userinfo.vuechatName,
                            sendAccountName: this.sendUserInfo.vuechatName
                        };
                        const sendChatMsgInfo = {
                            ...commonMsgInfo,
                            sendAccountAndTargetAccountId: this.userid + this.userinfo._id
                        };
                        const targetChatMsgInfo = {
                            ...commonMsgInfo,
                            sendAccountAndTargetAccountId: this.userinfo._id + this.userid
                        };
                        const chatInfoArr = [sendChatMsgInfo, targetChatMsgInfo];

                        if (idx === 1) {
                            this.socket.emit('sendChatMessage', chatInfoArr);
                        } else {
                            this.socket.emit('sendOffLineChatMessage', chatInfoArr);
                        }
                    }
                });
            }
        },
        scrollToButtom() {
            this.$nextTick(() => {
                const chatboxContainer = this.$refs.chatbox; // 获取对象
                if (chatboxContainer) {
                    document.body.scrollTop = chatboxContainer.scrollHeight; // 滚动高度
                    document.documentElement.scrollTop = chatboxContainer.scrollHeight;
                }
            });
        },
        playChatVoice(audio) {
            const audioUrl = audio;
            if (audioUrl) {
                const audioExample = new Audio();
                audioExample.src = audioUrl; // 想要播放的音频地址
                audioExample.play();
            } else {
                Toast('语音地址已被摧毁');
            }
        },
        MsgSort(arr) {
            arr.sort((a, b) => {
                const t1 = new Date(a.chatTime);
                const t2 = new Date(b.chatTime);
                return t1.getTime() - t2.getTime();
            });
            return arr;
        }
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
