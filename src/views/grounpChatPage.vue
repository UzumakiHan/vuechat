<template>
    <div @click="faceShow = false">
        <van-nav-bar
            :title="chatRoomTitle"
            :fixed="true"
            style="z-index: 99"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        >
            <template v-slot:right>
                <van-icon
                    name="more"
                    size="18"
                    @click="goGrounpChatInfo"
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
                    v-if="chatAccountItem.sendAccountId === userid"
                    :key="chatAccountIndex"
                    class="chat-receiver"
                >
                    <div>
                        <img :src="chatAccountItem.sendAccountAvatar">
                    </div>
                    <div>{{ chatAccountItem.sendAccountName }}</div>
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
                    v-else
                    :key="'info2-' + chatAccountIndex"
                    class="chat-sender"
                >
                    <div @click="checkUserInfo(chatAccountItem)">
                        <img :src="chatAccountItem.sendAccountAvatar">
                    </div>
                    <div>{{ chatAccountItem.sendAccountName }}</div>
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
                        <van-image
                            :src="chatAccountItem.chatImg"
                            @click="previewImg(chatAccountItem.chatImg)"
                        />
                    </div>
                    <div class="chat-notice">
                        <span>{{ $moment(chatAccountItem.chatTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                    </div>
                </div>
            </template>
        </div>
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
import {Toast, ImagePreview} from 'vant';
import axios from 'axios';
import {getGroupChatList, getChatUserInfo, getChatRoomInfo} from '../api';
import Recorderx, {ENCODE_TYPE} from 'recorderx';
const emojData = require('@/assets/emojis.json');
const rc = new Recorderx();
export default {
    data() {
        return {
            chatRoom: null,
            chatRoomId: '',
            chatRoomTitle: '',
            chatRoomName: '',
            chatRoomImg: '',
            avatar: require('../assets/images/avatar.jpg'),
            keyboard: require('../assets/images/keyboard.png'),
            voice: require('../assets/images/voice-circle.png'),
            recordvoice: require('../assets/images/voice.png'),
            sendvoice: require('../assets/images/send.png'),
            voiceKeyBoardFlag: true, // 语音键盘切换
            chatMsg: '', // 聊天文本
            userid: '', // 用户id
            sendUserInfo: {},
            chatRecordList: [], // 聊天记录
            onlineUserList: [], // 在线用户
            faceList: [], // 表情数组
            faceShow: false,
            fileList: [], // 图片
            timeOutEvent: 0,
            startime: 0,
            endtime: 0
        };
    },
    mounted() {
        this.userid = localStorage.getItem('vuechatid');
        this.sendUserInfo = this.$store.state.userInfo;
        this.getChatRoomInfo();
        this.socket = this.$socketio.connect(this.$socketHost, {
            transports: ['websocket', 'xhr-polling', 'jsonp-polling']
        });
        this.socket.on('receiveGrounpChatMessage', msg => {
            if (this.chatRoomId === msg.chatRoomId) {
                this.chatRecordList.push(msg);
                this.scrollToButtom();
            }
        });
        this.getGroupChatList();
    },
    methods: {
        // 获取聊天室信息
        async getChatRoomInfo() {
            this.chatRoomId = this.$route.query.id;
            const result = await getChatRoomInfo(this.chatRoomId);
            if (result.data.status === 2) {
                this.chatRoom = result.data.chatRoomInfo;
                this.chatRoomTitle = `${this.chatRoom.chatRoomName}(${this.chatRoom.chatRoomMemberId.length})`;
                this.chatRoomName = this.chatRoom.chatRoomName;
                this.chatRoomImg = this.chatRoom.chatRoomImg;
            }
        },
        onClickLeft() {
            this.$router.go(-1);
        },
        // 获取所有表情
        faceContent() {
            // this.faceList = []
            this.faceShow = !this.faceShow;
            this.faceList = [];
            this.$refs.sendinput.foucs();
            if (this.faceShow === true) {
                for (const i in emojData) {
                    this.faceList.push(emojData[i].char);
                }
            } else {
                this.faceList = [];
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
        // 发送图片
        async uploadImg(file) {
            this.fileList = [];

            const chatRoomMemberId = this.chatRoom.chatRoomMemberId;
            const chatMsgInfo = {
                chatRoomName: this.chatRoomName,
                chatRoomImg: this.chatRoomImg,
                chatRoomId: this.chatRoomId,
                chatMessage: '',
                chatImg: file.content,
                chatVoice: '',
                chatTime: new Date(),
                sendAccountId: this.userid,
                sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
                sendAccountName: this.sendUserInfo.vuechatName,
                chatRoomMemberId: chatRoomMemberId
            };
            this.socket.emit('sendGrounpChatMessage', chatMsgInfo);
        },
        // 图片预览
        previewImg(img) {
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
                .catch(error => {
                    throw Error(error);
                });
        },
        // 发送语音
        async sendVoice() {
            rc.pause();
            this.endtime = new Date();
            const wav = rc.getRecord({
                encodeTo: ENCODE_TYPE.WAV,
                compressible: true
            });
            const voiceTime = Math.ceil((this.endtime - this.startime) / 1000);
            const formData = new FormData();

            formData.append('chatVoice', wav, `${Date.parse(new Date())  }.wav`);
            formData.append('voiceTime', voiceTime);
            const headers = {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'multipart/form-data'
                }
            };
            const uploadChatVoiceApi =
                process.env.NODE_ENV === 'development' ? '/api/chatlist/uploadChatVoice' : '/chatlist/uploadChatVoice';
            axios.post(uploadChatVoiceApi, formData, headers).then(res => {
                if (res.data.status === 2) {
                    rc.clear();
                    const chatVoiceMsg = res.data.chatVoiceMsg;
                    const chatRoomMemberId = this.chatRoom.chatRoomMemberId;
                    const chatMsgInfo = {
                        chatRoomName: this.chatRoomName,
                        chatRoomImg: this.chatRoomImg,
                        chatRoomId: this.chatRoomId,
                        chatMessage: '',
                        chatImg: '',
                        chatVoice: chatVoiceMsg,
                        chatTime: new Date(),
                        sendAccountId: this.userid,
                        sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
                        sendAccountName: this.sendUserInfo.vuechatName,
                        chatRoomMemberId: chatRoomMemberId
                    };
                    this.socket.emit('sendGrounpChatMessage', chatMsgInfo);
                }
            });
        },
        // 发送消息
        async sendChatMsg() {
            const chatRoomMemberId = this.chatRoom.chatRoomMemberId;
            const chatMsgInfo = {
                chatRoomName: this.chatRoomName,
                chatRoomImg: this.chatRoomImg,
                chatRoomId: this.chatRoomId,
                chatMessage: this.chatMsg,
                chatImg: '',
                chatVoice: '',
                chatTime: new Date(),

                sendAccountId: this.userid,
                sendAccountAvatar: this.sendUserInfo.vuechatAvatar,
                sendAccountName: this.sendUserInfo.vuechatName,
                chatRoomMemberId: chatRoomMemberId
            };
            this.chatMsg = '';
            this.socket.emit('sendGrounpChatMessage', chatMsgInfo);
        },
        // 获取所有聊天记录
        async getGroupChatList() {
            const chatRoomId = this.userid + this.chatRoomId;
            const result = await getGroupChatList(chatRoomId);
            if (result.data.status === 2) {
                this.chatRecordList = result.data.groupChatList.reverse();
                this.scrollToButtom();
                const chatRecordListLength = this.chatRecordList.length;
                for (let i = 0; i < chatRecordListLength; i++) {
                    if (this.chatRecordList[i].sendAccountId !== this.userid) {
                        const chatUserInfo = await getChatUserInfo(this.chatRecordList[i].sendAccountId);
                        this.chatRecordList[i].sendAccountName = chatUserInfo.data.userinfo.vuechatName;
                        this.chatRecordList[i].sendAccountAvatar = chatUserInfo.data.userinfo.vuechatAvatar;
                    }
                }
            } else {
                Toast(result.data.message);
            }
        },
        // 滚到底部
        scrollToButtom() {
            this.$nextTick(() => {
                const chatboxContainer = this.$refs.chatbox; // 获取对象
                if (chatboxContainer) {
                    document.body.scrollTop = chatboxContainer.scrollHeight; // 滚动高度
                    document.documentElement.scrollTop = chatboxContainer.scrollHeight;
                }
            });
        },
        // 播放语音
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
        // 跳转到群资料页面
        goGrounpChatInfo() {
            this.$router.push({
                name: 'GrounpChatInfo',
                query: {
                    id: this.chatRoomId
                }
            });
        },
        // 查看用户资料
        async checkUserInfo(chatAccountItem) {
            const result = await getChatUserInfo(chatAccountItem.sendAccountId);
            const userinfo = result.data.userinfo;
            this.$router.push({
                name: 'ChatUserInfo',
                query: {
                    userinfo: JSON.stringify(userinfo)
                }
            });
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
