<template>
    <div>
        <van-nav-bar
            :title="title"
            :fixed="true"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="search-box">
            <van-field
                v-model="searchVal"
                left-icon="search"
                placeholder="请输入vuechat号搜索"
                style="flex: 1"
            />
            <van-button
                type="info"
                size="mini"
                @click="searchFriends"
            >
                查找
            </van-button>
        </div>
        <van-empty
            v-if="noSearch"
            description="该用户不存在"
        />
        <ul
            v-if="hasSearch"
            class="search-list"
        >
            <li
                v-for="(item, index) in searchList"
                :key="index"
                class="search-item"
                @click="goToUserDetail(item)"
            >
                <van-image
                    width="60"
                    height="60"
                    :src="item.vuechatAvatar"
                />
                <div class="userinfo">
                    <p>
                        <span>vuechat号：</span>
                        <span>{{ item.vuechatAccount }}</span>
                    </p>
                    <p>
                        <span>vuechat昵称：</span>
                        <span>{{ item.vuechatName }}</span>
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import {searchVueChatAccount, searchMyFriend} from '../api';
export default {
    data() {
        return {
            searchVal: '',
            noSearch: false,
            hasSearch: false,
            searchList: [],
            title: '',
            searchKey: 0,
            userid: ''
        };
    },
    mounted() {
        const keyInfo = JSON.parse(this.$route.query.keyInfo);
        this.title = keyInfo.title;
        this.searchKey = keyInfo.searchKey;
        this.userid = localStorage.getItem('vuechatid');
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
        async searchFriends() {
            this.searchList = [];
            this.hasSearch = this.noSearch = false;
            if (this.searchKey === 1) {
                const userInfo = {
                    vuechatAccount: this.searchVal
                };
                const result = await searchVueChatAccount(userInfo);
                this.hasSearch = true;
                if (result.data.status === 2) {
                    this.searchList.push(result.data.userInfo);
                }
            } else {
                const userInfo = {
                    vuechatAccount: this.searchVal,
                    id: this.userid
                };
                const result = await searchMyFriend(userInfo);
                this.hasSearch = true;
                if (result.data.searchFlag === true) {
                    this.searchList.push(result.data.userInfo);
                }
            }
        },
        goToUserDetail(userinfo) {
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
