<template>
    <div class="mail-list">
        <van-nav-bar
            title="选择好友"
            :fixed="true"
            style="z-index: 99"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        />
        <van-index-bar
            v-if="mailList.length > 0"
            highlight-color="#fb6463"
            style=" z-index: 97;margin-top: 50px; margin-bottom: 70px"
        >
            <div
                v-for="(mailName, index) in LastMailList"
                :key="index"
            >
                <van-index-anchor :index="index" />
                <van-checkbox-group v-model="selectResult">
                    <van-cell-group>
                        <van-cell
                            v-for="(item, cindex) in mailName"
                            :key="cindex"
                            clickable
                            @click="toggle(item)"
                        >
                            <van-checkbox
                                ref="checkboxes"
                                :name="item"
                            />
                            <van-image
                                width="50"
                                height="50"
                                :src="item.vuechatAvatar"
                            />
                            <span class="chat-name">{{ item.vuechatAccount }}</span>
                        </van-cell>
                    </van-cell-group>
                </van-checkbox-group>
            </div>
            <van-cell class="btn-cell">
                <van-button
                    type="primary"
                    @click="checkAll"
                >
                    全选
                </van-button>
                <van-button
                    type="info"
                    style="margin: 0 10px"
                    @click="toggleAll"
                >
                    反选
                </van-button>
                <van-button
                    type="info"
                    color="#337ab7"
                    @click="sureAddChat"
                >
                    确定
                </van-button>
            </van-cell>
        </van-index-bar>
        <van-empty
            v-else
            description="暂无好友"
        />
    </div>
</template>
<script>
import axios from 'axios';
import {getMailList} from '../api';
import {Toast} from 'vant';
import pinyin from 'wl-pinyin';
export default {
    data() {
        return {
            userid: '',
            selectResult: [],
            addIcon: require('../assets/images/add-icon.png'),
            AlphabetList: [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z'
            ],
            mailList: [], // 通讯录数据
            LastMailList: {},
            wechatBg: require('../assets/images/wechatbg.png'),
            chatRoomMemberId: null,
            chatRoomInfo: null,
            chatRoomId: ''
        };
    },
    mounted() {
        this.userid = localStorage.getItem('vuechatid');
        if (this.$route.query.chatRoomInfo) {
            this.chatRoomInfo = JSON.parse(this.$route.query.chatRoomInfo);
            this.chatRoomMemberId = this.chatRoomInfo.chatRoomMemberId;
            this.chatRoomId = this.chatRoomInfo._id;
        }
        this.getMailList();
        Array.prototype.remove = function (val) {
            const index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
    },
    methods: {
        toggle(item) {
            const allcheckboxes = this.$refs.checkboxes;
            allcheckboxes.forEach(checkboxes => {
                if (item._id === checkboxes.name._id) {
                    if (checkboxes.checked) {
                        this.selectResult.remove(item);
                    } else {
                        this.selectResult.push(item);
                    }
                }
            });
        },
        // 全选
        checkAll() {
            this.selectResult = [];
            const allcheckboxes = this.$refs.checkboxes;
            allcheckboxes.forEach(checkboxes => {
                this.selectResult.push(checkboxes.name);
            });
        },
        // 反选
        toggleAll() {
            const allcheckboxes = this.$refs.checkboxes;
            allcheckboxes.forEach(checkboxes => {
                if (checkboxes.checked) {
                    this.selectResult.remove(checkboxes.name);
                } else {
                    this.selectResult.push(checkboxes.name);
                }
            });
        },
        // 确定添加
        async sureAddChat() {
            // 添加群成员
            if (this.chatRoomMemberId) {
                if (this.selectResult.length > 0) {
                    const selectResultIds = [];
                    this.selectResult.forEach(chatRoomMember => {
                        selectResultIds.push(chatRoomMember._id);
                    });
                    // 比较
                    const filterResult = selectResultIds.filter(n => {
                        return this.chatRoomMemberId.indexOf(n) !== -1;
                    });
                    if (filterResult.length > 0) {
                        Toast('请勿重复添加群成员');
                    } else {
                        // 把选择的群成员和原有的群成员合在一起
                        const allChatRoomMember = this.chatRoomMemberId.concat(selectResultIds);
                        const formData = new FormData();
                        formData.append('chatRoomMemberId', JSON.stringify(allChatRoomMember));
                        formData.append('chatRoomId', this.chatRoomId);
                        formData.append('selectResultIds', JSON.stringify(selectResultIds));
                        const headers = {
                            headers: {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'Content-Type': 'multipart/form-data'
                            }
                        };
                        const addChatMemberApi =
                            process.env.NODE_ENV === 'development'
                                ? '/api/chatroom/addChatMember'
                                : '/chatroom/addChatMember';

                        axios
                            .post(addChatMemberApi, formData, headers)
                            .then(res => {
                                Toast(res.data.message);
                                if (res.data.status === 2) {
                                    this.$router.push('/mychatgrounp');
                                }
                            })
                            .catch(err => {
                                throw Error(err);
                            });
                    }
                } else {
                    Toast('请选择好友');
                }
            } else {
                // 创建群聊
                if (this.selectResult.length > 1) {
                    const formData = new FormData();
                    const chatRoomMemberId = [];
                    this.selectResult.forEach(member => {
                        chatRoomMemberId.push(member._id);
                    });
                    chatRoomMemberId.push(this.userid);
                    formData.append('chatRoomMemberId', JSON.stringify(chatRoomMemberId));
                    formData.append('chatRoomImg', this.wechatBg);
                    formData.append('chatRoomOwner', this.userid);
                    const headers = {
                        headers: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            'Content-Type': 'multipart/form-data'
                        }
                    };
                    const createChatRoomApi =
                        process.env.NODE_ENV === 'development'
                            ? '/api/chatroom/createChatRoom'
                            : '/chatroom/createChatRoom';

                    axios
                        .post(createChatRoomApi, formData, headers)
                        .then(res => {
                            if (res.data.status === 2) {
                                Toast(res.data.message);
                                this.$router.push('/mychatgrounp');
                            } else {
                                Toast('创建失败');
                            }
                        })
                        .catch(err => {
                            throw Error(err);
                        });
                } else {
                    Toast('请选择大于1个人的群聊');
                }
            }
        },
        // 通讯录获取
        async getMailList() {
            const id = localStorage.getItem('vuechatid');
            const result = await getMailList(id);
            this.mailList = result.data.mailList;
            this.initMailList();
        },
        // 将获取到的数据转化成通讯录格式的数据
        initMailList() {
            // 拼接数据
            const firstName = {};
            this.AlphabetList.forEach(item => {
                firstName[item] = [];
                this.mailList.forEach(el => {
                    const firstStr = el.vuechatAccount.substring(0, 1);
                    let first;
                    if (/[A-z]/.test(firstStr)) {
                        if (/[A-Z]/.test(el.vuechatAccount)) {
                            first = el.vuechatAccount.substring(0, 1);
                        } else {
                            first = el.vuechatAccount.substring(0, 1).toUpperCase();
                        }
                        if (first === item) {
                            firstName[item].push(el);
                        }
                        // 大小写转换
                    } else {
                        first = pinyin.getFirstLetter(el.vuechatAccount).substring(0, 1);
                        if (first === item) {
                            firstName[item].push(el);
                        }
                    }
                });
            });
            this.LastMailList = firstName;
        },
        onClickLeft() {
            this.$router.go(-1);
        }
    }
};
</script>
<style scoped lang="less">
.van-cell__value {
    display: flex;
    align-items: center;

    .chat-name {
        margin-left: 10px;
        font-size: 15px;
    }
}

.btn-cell {
    position: fixed;
    z-index: 99;
    bottom: 0;
}
</style>
