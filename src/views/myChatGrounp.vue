<template>
    <div>
        <van-nav-bar
            title="我的群组"
            :fixed="true"
            style="z-index: 99"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        >
            <template v-slot:right>
                <van-icon
                    name="add-o"
                    size="18"
                    @click="addChatGrounp"
                />
            </template>
        </van-nav-bar>
        <van-list
            v-if="myChatGrounp.length > 0"
            style="margin-top: 46px"
        >
            <van-cell
                v-for="(chatroom, chatindex) in myChatGrounp"
                :key="chatindex"
                @click="goToGrounpChatPage(chatroom)"
            >
                <van-image
                    width="50"
                    height="50"
                    :src="chatroom.chatRoomImg"
                />
                <div class="chat-info">
                    <p class="chat-title">
                        {{ chatroom.chatRoomName }}
                    </p>
                </div>
            </van-cell>
            <p class="grounp-text">
                共{{ myChatGrounp.length }}个群组
            </p>
        </van-list>
        <van-empty
            v-else
            description="暂无群组"
        />
    </div>
</template>

<script>
import {Toast} from 'vant';
import axios from 'axios';
export default {
    data() {
        return {
            myChatGrounp: [],
            userid: '',
            userinfo: null
        };
    },
    async mounted() {
        this.getUserInfo();
    },
    methods: {
        async getUserInfo() {
            this.userid = localStorage.getItem('vuechatid');
            this.userinfo = await this.$store.dispatch('getMyInfo', this.userid);
            this.getAllMyChatRoom();
        },
        addChatGrounp() {
            this.$router.push('/selectchatfriends');
        },
        onClickLeft() {
            this.$router.push('/my');
        },
        async getAllMyChatRoom() {
            const chatRoomIdArr = JSON.stringify(this.userinfo.chatRooms);
            const formData = new FormData();
            formData.append('chatRoomIdArr', chatRoomIdArr);
            const headers = {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'multipart/form-data'
                }
            };
            const myChatRoomApi =
                process.env.NODE_ENV === 'development' ? '/api/chatroom/myChatRoom' : '/chatroom/myChatRoom';
            axios
                .post(myChatRoomApi, formData, headers)
                .then(res => {
                    if (res.data.status === 2) {
                        this.myChatGrounp = res.data.allMyChatRoom;
                    } else {
                        Toast('获取群组失败');
                    }
                })
                .catch(err => {
                    throw Error(err);
                });
        },
        // 跳转到群聊
        goToGrounpChatPage(chatRoom) {
            this.$router.push({
                name: 'GrounpChatPage',
                query: {
                    id: chatRoom._id
                }
            });
        }
    }
};
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
