<template>
    <div @click="cleanFlag = false">
        <van-nav-bar
            :title="title"
            :fixed="true"
            style="z-index: 99"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="grounp-chat-info">
            <ul class="account-info">
                <li
                    v-for="(account, index) in chatRoomMember"
                    :key="index"
                    class="vuechat-account-info"
                    @click="checkUserInfo(account)"
                >
                    <img
                        :src="account.vuechatAvatar"
                        class="vuechatavatar"
                    >
                    <p class="vuechatname">
                        {{ account.vuechatName }}
                    </p>
                    <van-icon
                        v-if="cleanFlag"
                        name="clear"
                        class="clean-icon"
                        color="#e01d06"
                        size="20"
                        @click="showCleanDialog(account)"
                    />
                </li>
                <li
                    class="add-account-box"
                    @click="addChatMember"
                >
                    <van-icon
                        name="plus"
                        color=" #969799"
                    />
                </li>
                <li
                    v-if="userid === chatRoomOwner && chatRoomMember.length > 3"
                    class="add-account-box"
                    @click.stop="showCleanIcon"
                >
                    <van-icon
                        name="minus"
                        color=" #969799"
                    />
                </li>
            </ul>
            <van-cell-group style="margin-top: 10px">
                <van-cell
                    title="群聊名称"
                    is-link
                    :value="chatRoomName"
                    @click="openEditNameDialog"
                />
                <van-cell
                    title="群公告"
                    :label="chatRoomAd"
                    center
                    is-link
                    @click="openEditAdDialog"
                />
            </van-cell-group>
            <van-cell-group style="margin-top: 10px; margin-bottom: 10px">
                <van-cell
                    title="清除聊天记录"
                    is-link
                    @click="cleanChatList"
                />
            </van-cell-group>
            <van-button
                type="danger"
                size="large"
                @click="deleteChatGrounp"
            >
                删除并退出
            </van-button>
        </div>
        <van-dialog
            v-model="dialogshow"
            title="更改群昵称"
            show-cancel-button
            @confirm="confirmEdit"
        >
            <van-field
                v-model="chatRoomName"
                placeholder="请输入群昵称"
                input-align="center"
            />
        </van-dialog>
        <van-dialog
            v-model="adDialogshow"
            title="更改群公告"
            show-cancel-button
            @confirm="confirmEditAd"
        >
            <van-field
                v-model="chatRoomAd"
                placeholder="请输入群公告"
                input-align="center"
            />
        </van-dialog>
    </div>
</template>

<script>
import {
    getChatUserInfo,
    editChatRoomName,
    editChatRoomAd,
    getChatRoomInfo,
    removeChatMember,
    cleanChatList,
    deleteChatOwner
} from '../api';
import {Toast, Dialog} from 'vant';
export default {
    inject: ['reload'],
    data() {
        return {
            chatRoomInfo: null,
            title: '',
            chatRoomName: '',
            chatRoomMember: [],
            chatRoomOwner: '',
            userid: '',
            dialogshow: false,
            adDialogshow: false,
            chatRoomAd: '',
            chatRoomMemberId: null,
            cleanFlag: false,
            chatRoomId: ''
        };
    },
    async mounted() {
        this.userid = localStorage.getItem('vuechatid');

        await this.getChatRoomInfo();
        this.getChatRoomMember();
    },
    methods: {
        async getChatRoomInfo() {
            this.chatRoomId = this.$route.query.id;

            const result = await getChatRoomInfo(this.chatRoomId);
            // console.log(result)
            if (result.data.status === 2) {
                this.chatRoomInfo = result.data.chatRoomInfo;
                this.title = `聊天信息(${this.chatRoomInfo.chatRoomMemberId.length})`;
                this.chatRoomName = this.chatRoomInfo.chatRoomName;
                this.chatRoomOwner = this.chatRoomInfo.chatRoomOwner;
                this.chatRoomAd = this.chatRoomInfo.chatRoomAd;
                this.chatRoomMemberId = this.chatRoomInfo.chatRoomMemberId;
            }
        },
        openEditNameDialog() {
            this.dialogshow = true;
        },
        async confirmEdit() {
            if (this.chatRoomName === '') {
                Toast('群昵称不能为空');
                this.chatRoomName = this.chatRoomInfo.chatRoomName;
            } else {
                const editInfo = {
                    id: this.chatRoomId,
                    chatRoomName: this.chatRoomName
                };
                const result = await editChatRoomName(editInfo);
                Toast(result.data.message);
            }

            // console.log(1)
        },
        openEditAdDialog() {
            this.adDialogshow = true;
        },
        async confirmEditAd() {
            const editAdInfo = {
                id: this.chatRoomId,
                chatRoomAd: this.chatRoomAd
            };
            const result = await editChatRoomAd(editAdInfo);
            Toast(result.data.message);
        },
        onClickLeft() {
            this.$router.go(-1);
        },
        // 获取群成员
        async getChatRoomMember() {
            const chatRoomMemberId = this.chatRoomInfo.chatRoomMemberId;
            for (let i = 0; i < chatRoomMemberId.length; i++) {
                if (chatRoomMemberId[i] === this.chatRoomOwner) {
                    chatRoomMemberId.splice(i, 1);
                    break;
                }
            }
            chatRoomMemberId.unshift(this.chatRoomOwner);
            chatRoomMemberId.forEach(async chatRoomMember => {
                const result = await getChatUserInfo(chatRoomMember);
                await this.chatRoomMember.push(result.data.userinfo);
            });
        },
        // 添加群成员
        addChatMember() {
            // console.log(this.chatRoomMemberId)
            this.$router.push({
                name: 'SelectChatFriends',
                query: {
                    chatRoomInfo: JSON.stringify(this.chatRoomInfo)
                }
            });
        },
        // 显示移除按钮
        showCleanIcon() {
            this.cleanFlag = true;
        },
        // 显示删除弹框
        showCleanDialog(account) {
            const removeInfo = {
                chatRoomId: this.chatRoomId,
                removeChatId: account._id
            };
            Dialog.confirm({
                message: '确定移除该用户吗？'
            })
                .then(async () => {
                    // console.log(removeInfo);
                    const result = await removeChatMember(removeInfo);
                    Toast(result.data.message);
                    if (result.data.status === 2) {
                        setTimeout(() => {
                            this.reload();
                        }, 1000);
                    }
                })
                .catch(() => {
                    this.cleanFlag = false;
                    // on cancel
                });
        },
        // 清除聊天记录
        cleanChatList() {
            const sendAccountAndchatRoomId = this.userid + this.chatRoomId;
            Dialog.confirm({
                message: '确定删除聊天记录吗？'
            })
                .then(async () => {
                    const result = await cleanChatList(sendAccountAndchatRoomId);
                    Toast(result.data.message);
                })
                .catch(() => {
                    // on cancel
                });
        },
        // 删除退出
        deleteChatGrounp() {
            Dialog.confirm({
                title: '退出群聊',
                message: `将群组“${this.chatRoomName}”删除，将同时删除与该群组的聊天记录`
            })
                .then(async () => {
                    if (this.userid === this.chatRoomOwner) {
                        this.chatRoomMemberId.splice(
                            this.chatRoomMemberId.findIndex(item => item === this.userid),
                            1
                        );
                        const newChatRoomOwner = this.chatRoomMemberId[0];
                        const removeInfo = {
                            chatRoomId: this.chatRoomId,
                            removeChatId: this.userid,
                            newChatRoomOwner: newChatRoomOwner
                        };
                        const result = await deleteChatOwner(removeInfo);
                        Toast(result.data.message);
                        if (result.data.status === 2) {
                            this.$router.push('/mychatgrounp');
                        }
                    } else {
                        const removeInfo = {
                            chatRoomId: this.chatRoomId,
                            removeChatId: this.userid
                        };
                        const result = await removeChatMember(removeInfo);
                        Toast(result.data.message);
                        if (result.data.status === 2) {
                            this.$router.push('/mychatgrounp');
                        }
                    }
                })
                .catch(() => {
                    // on cancel
                });
        },
        // 查看用户资料
        async checkUserInfo(account) {
            this.$router.push({
                name: 'ChatUserInfo',
                query: {
                    userinfo: JSON.stringify(account)
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.grounp-chat-info {
    margin-top: 46px;

    .account-info {
        // width: 100%;
        padding: 10px;
        // height: 300px;
        background-color: #fff;
        list-style: none;
        display: flex;
        flex-wrap: wrap;

        .vuechat-account-info {
            display: flex;
            // flex: 1;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 7px 4px;
            position: relative;
            // width: 80px;
            height: 80px;

            .vuechatavatar {
                width: 60px;
                height: 60px;
                border-radius: 8px;
            }

            .vuechatname {
                // width: 60;
                font-size: 14px;
                text-align: center;
                color: #969799;
                margin-top: 4px;
            }

            .clean-icon {
                position: absolute;
                top: -10px;
                right: 0;
            }
        }

        .add-account-box {
            margin: 7px 4px;
            width: 60px;
            height: 60px;
            border-radius: 8px;
            border: 1px dotted #969799;
            display: flex;
            align-items: center;
            justify-content: center;
            // background-color: red;
        }
    }
}
</style>
