<template>
    <div class="mail-list">
        <van-nav-bar
            title="通讯录"
            :fixed="true"
            style="z-index: 99"
        >
            <template v-slot:right>
                <van-icon
                    name="search"
                    size="18"
                    @click="goToSearchFriends"
                />
                <van-icon
                    :name="addIcon"
                    size="18"
                    style="margin-left: 6px"
                    @click="goToAddFriends"
                />
            </template>
        </van-nav-bar>
        <van-index-bar
            v-if="mailList.length > 0"
            highlight-color="#fb6463"
            style=" z-index: 97;margin-top: 50px; margin-bottom: 60px"
        >
            <div
                v-for="(mailName, index) in LastMailList"
                :key="index"
            >
                <van-index-anchor :index="index" />
                <van-cell
                    v-for="(item, cindex) in mailName"
                    :key="cindex"
                    @click="checkVuechatInfo(item)"
                >
                    <van-image
                        width="50"
                        height="50"
                        :src="item.vuechatAvatar"
                    />
                    <span class="chat-name">{{ item.vuechatAccount }}</span>
                </van-cell>
            </div>
        </van-index-bar>
        <van-empty
            v-else
            description="暂无好友"
        />
    </div>
</template>
<script>
import {getMailList} from '../api';
import pinyin from 'wl-pinyin';
export default {
    data() {
        return {
            addIcon: require('../assets/images/add-icon.svg'),
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
            LastMailList: {}
        };
    },
    mounted() {
        this.getMailList();
    },
    methods: {
        goToAddFriends() {
            const keyInfo = {
                searchKey: 1,
                title: '添加好友'
            };
            this.$router.push({
                name: 'SearchFriends',
                query: {
                    keyInfo: JSON.stringify(keyInfo)
                }
            });
            // this.$router.push("/searchfriends");
        },
        goToSearchFriends() {
            const keyInfo = {
                searchKey: 2,
                title: '搜索好友'
            };
            this.$router.push({
                name: 'SearchFriends',
                query: {
                    keyInfo: JSON.stringify(keyInfo)
                }
            });
        },
        // 通讯录获取
        async getMailList() {
            const id = localStorage.getItem('vuechatid');
            const result = await getMailList(id);
            this.mailList = result.data.mailList;
            // conso
            this.initMailList();
        },
        // 将获取到的数据转化成通讯录格式的数据
        initMailList() {
            // 拼接数据
            const firstName = {};
            this.AlphabetList.forEach(item => {
                firstName[item] = [];
                this.mailList.forEach(el => {
                    //  console.log(el)
                    const firstStr = el.vuechatAccount.substring(0, 1);
                    let first;
                    // console.log(/[A-z]/.test(el.substring(0, 1)))
                    if (/[A-z]/.test(firstStr)) {
                        // console.log(/[A-Z]/.test(el))
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
        // 查看用户消息
        checkVuechatInfo(userinfo) {
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
<style scoped lang="less">
.van-cell__value {
    display: flex;
    align-items: center;

    .chat-name {
        margin-left: 10px;
        font-size: 15px;
    }
}
</style>
