<template>
    <div class="home">
        <van-nav-bar title="首页" />
        <van-list v-if="allChatList.length > 0">
            <template v-for="(item, index) in allChatList">
                <van-cell
                    v-if="item.targetAccountAvatar || item.chatRoomId"
                    :key="index"
                    @click="sendMessage(item)"
                >
                    <van-image
                        v-if="item.chatRoomId"
                        width="50"
                        height="50"
                        :src="item.chatRoomImg"
                    />
                    <van-image
                        v-else
                        width="50"
                        height="50"
                        :src="
                            item.sendAccountId === $store.state.userInfo._id
                                ? item.targetAccountAvatar
                                : item.sendAccountAvatar
                        "
                    />
                    <div
                        v-if="item.chatRoomId"
                        class="chat-info"
                    >
                        <p
                            class="chat-title"
                            style="justify-content: space-between"
                        >
                            <span>{{ item.chatRoomName }}</span>
                            <span class="chat-time">{{ $moment(item.chatTime).format('HH:mm:ss') }}</span>
                        </p>
                        <p
                            v-if="item.chatMessage"
                            class="chat-content"
                        >
                            {{ item.sendAccountName }}:{{ item.chatMessage }}
                        </p>
                        <p
                            v-if="item.chatImg"
                            class="chat-content"
                        >
                            {{ item.sendAccountName }}:[ 图片 ]
                        </p>
                        <p
                            v-if="item.chatVoice"
                            class="chat-content"
                        >
                            {{ item.sendAccountName }}:[ 语音 ]
                        </p>
                    </div>
                    <div
                        v-else
                        class="chat-info"
                    >
                        <p
                            class="chat-title"
                            style="justify-content: space-between"
                        >
                            <span>{{
                                item.sendAccountId === $store.state.userInfo._id
                                    ? item.targetAccountName
                                    : item.sendAccountName
                            }}</span>
                            <span class="chat-time">{{ $moment(item.chatTime).format('HH:mm:ss') }}</span>
                        </p>
                        <p
                            v-if="item.chatMessage"
                            class="chat-content"
                        >
                            {{ item.chatMessage }}
                        </p>
                        <p
                            v-if="item.chatImg"
                            class="chat-content"
                        >
                            [ 图片 ]
                        </p>
                        <p
                            v-if="item.chatVoice"
                            class="chat-content"
                        >
                            [ 语音 ]
                        </p>
                    </div>
                    <!-- <div class="chat-time">{{$moment(item.chatTime).format('HH:mm:ss')}}</div> -->
                </van-cell>
            </template>
        </van-list>
        <van-empty
            v-else
            description="暂未聊天消息"
        />
    </div>
</template>
<script>
// import moment from "moment";
import {alldigtalChatList, getUserInfo, getAllgrounpChatList} from '../api';

export default {
    data() {
        return {
            active: 0,
            msg: '',
            chatUserList: [],
            chatUserLists: [],
            socket: null,
            list: [],
            loading: false,
            finished: false,
            refreshing: false,
            userid: '',
            friendIds: [],
            allChatList: [],
            chatRooms: null // 我的群组
        };
    },

    mounted() {
        this.socket = this.$socketio.connect(this.$socketHost, {
            transports: ['websocket', 'xhr-polling', 'jsonp-polling']
        });
        this.chatRooms = this.$store.state.userInfo.chatRooms;
        this.alldigtalChatList();
        if (this.userid) {
            this.socket.emit('online', this.userid);
            this.socket.on('userlist', msg => {
                localStorage.setItem('userlistId', JSON.stringify(msg));
            });
        }
        // 实时监听在线私聊消息
        this.socket.on('receiveChatMessage', msg => {
            this.handleReceiveMsg(msg);
        });
        // 实时监听离线私聊消息
        this.socket.on('receiveOffLineChatMessage', msg => {
            this.handleReceiveMsg(msg);
        });

        // 实时监听群聊消息
        this.socket.on('receiveGrounpChatMessage', msg => {
            if (msg) {
                // 判断是不是我的群组
                const isMyChatRoom = this.$store.state.userInfo.chatRooms.findIndex(
                    chatRoomId => chatRoomId === msg.chatRoomId
                );
                if (isMyChatRoom !== -1) {
                    for (let i = 0; i < this.allChatList.length; i++) {
                        if (this.allChatList[i].chatRoomId && this.allChatList[i].chatRoomId === msg.chatRoomId) {
                            this.handleCommonMsg(msg, i);

                            this.allChatList[i].chatTime = msg.chatTime;
                            this.allChatList[i].chatRoomName = msg.chatRoomName;
                            this.allChatList[i].sendAccountName = msg.sendAccountName;
                            this.allChatList[i].chatRoomImg = msg.chatRoomImg;
                        }
                    }
                }
            }
        });
    },
    methods: {
        handleCommonMsg(msg, i) {
            if (msg.chatMessage) {
                this.allChatList[i].chatVoice = '';
                this.allChatList[i].chatImg = '';
                this.allChatList[i].chatMessage = msg.chatMessage;
            } else if (msg.chatVoice) {
                this.allChatList[i].chatMessage = '';
                this.allChatList[i].chatImg = '';
                this.allChatList[i].chatVoice = msg.chatVoice;
            } else if (msg.chatImg) {
                this.allChatList[i].chatMessage = '';
                this.allChatList[i].chatVoice = '';
                this.allChatList[i].chatImg = msg.chatImg;
            }
        },
        handleReceiveMsg(msg) {
            if (msg && msg.targetAccountId === this.$store.state.userInfo._id) {
                const sendAccountAndTargetAccountId = msg.sendAccountId + msg.targetAccountId;
                const targetAccountAndSendAccountId = msg.targetAccountId + msg.sendAccountId;
                if (this.allChatList.length > 0) {
                    for (let i = 0; i < this.allChatList.length; i++) {
                        if (
                            sendAccountAndTargetAccountId === this.allChatList[i].sendAccountAndTargetAccountId ||
                            targetAccountAndSendAccountId === this.allChatList[i].sendAccountAndTargetAccountId
                        ) {
                            this.handleCommonMsg(msg, i);
                            this.allChatList[i].chatTime = msg.chatTime;
                        }
                    }
                }
            }
        },
        async alldigtalChatList() {
            this.userid = localStorage.getItem('vuechatid');
            const result = await alldigtalChatList(this.userid);
            const allgrounpChatListReault = await getAllgrounpChatList(this.userid);
            let allgrounpChatList;
            if (allgrounpChatListReault.data.status === 2) {
                allgrounpChatList = allgrounpChatListReault.data.allGrounpChatList;
            }
            const chatDigtalList = result.data.chatDigtalList;
            if (chatDigtalList) {
                this.allChatList.push(...chatDigtalList);
            }
            this.allChatList.push(...allgrounpChatList);
            this.allChatList = this.MsgSort(this.allChatList);
        },
        MsgSort(arr) {
            arr.sort((a, b) => {
                const t1 = new Date(a.chatTime);
                const t2 = new Date(b.chatTime);
                return t2.getTime() - t1.getTime();
            });
            return arr;
        },

        // 跳转到发消息的页面
        async sendMessage(item) {
            if (item.chatRoomId) {
                this.$router.push({
                    name: 'GrounpChatPage',
                    query: {
                        id: item.chatRoomId
                    }
                });
            } else {
                const targetId =
                    item.sendAccountId === this.$store.state.userInfo._id ? item.targetAccountId : item.sendAccountId;
                const result = await getUserInfo(targetId);
                const userinfo = result.data.userinfo;
                this.$router.push({
                    name: 'ChatPage',
                    query: {
                        userinfo: JSON.stringify(userinfo)
                    }
                });
            }
        },
        // JS数组去重，JS根据数组里面的对象属性值去重
        arrayUnique(arr, name) {
            const hash = {};
            return arr.reverse().reduce(function (item, next) {
                // eslint-disable-next-line sonarjs/no-redundant-boolean,no-unused-expressions
                hash[next[name]] ? '' : (hash[next[name]] = true && item.push(next));
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
