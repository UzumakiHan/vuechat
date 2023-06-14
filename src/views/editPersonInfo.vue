<template>
    <div class="myinfo">
        <van-nav-bar
            title="编辑资料"
            left-text="返回主页"
            left-arrow
            right-text="完成"
            @click-left="onClickLeft"
            @click-right="editInfo"
        />
        <van-row
            type="flex"
            justify="center"
            style="margin-top: 10px"
        >
            <van-col>
                <!-- <van-uploader :after-read="afterRead" v-model="fileList" :max-count="1" v-if="false"/> -->
                <van-image
                    round
                    width="100px"
                    height="100px"
                    :src="userinfo.vuechatAvatar"
                />
            </van-col>
        </van-row>
        <van-row
            type="flex"
            justify="center"
            style="margin-bottom: 10px"
        >
            <van-uploader
                :after-read="afterRead"
                :max-count="1"
            >
                <van-button
                    icon="photo-o"
                    type="info"
                    size="mini"
                >
                    更改头像
                </van-button>
            </van-uploader>
        </van-row>
        <van-cell-group>
            <van-field
                v-model="userinfo.vuechatAccount"
                label="用户账号"
                :left-icon="accounticon"
                disabled
            />
            <van-field
                v-model="userinfo.vuechatName"
                label="用户名"
                :left-icon="usericon"
            />
            <van-field
                v-model="userinfo.sex"
                label="性别"
                :left-icon="sexicon"
            />
            <van-field
                v-model="userinfo.phone"
                label="手机号码"
                :left-icon="phoneicon"
            />
            <van-field
                v-model="userinfo.brithday"
                label="生日"
                :left-icon="brithdayicon"
            />
            <van-field
                v-model="userinfo.address"
                label="地址"
                :left-icon="addressicon"
            />
            <van-field
                v-model="userinfo.personalSign"
                rows="2"
                autosize
                label="个人签名"
                type="textarea"
                :left-icon="signicon"
            />
        </van-cell-group>
    </div>
</template>
<script>
import axios from 'axios';
import {Toast} from 'vant';
export default {
    name: 'Myinfo',
    data() {
        return {
            sexicon: require('../assets/images/sex.png'),
            accounticon: require('../assets/images/account.png'),
            usericon: require('../assets/images/user.png'),
            phoneicon: require('../assets/images/phone.png'),
            brithdayicon: require('../assets/images/brithday.png'),
            addressicon: require('../assets/images/address.png'),
            signicon: require('../assets/images/sign.png'),
            userinfo: {
                vuechatAvatar: this.$store.state.userInfo.vuechatAvatar,
                vuechatAccount: this.$store.state.userInfo.vuechatAccount,
                vuechatName: this.$store.state.userInfo.vuechatName,
                sex: this.$store.state.userInfo.sex,
                phone: this.$store.state.userInfo.phone,
                brithday: this.$store.state.userInfo.brithday,
                address: this.$store.state.userInfo.address,
                personalSign: this.$store.state.userInfo.personalSign
            },
            base64Avatar: '',
            userid: '',
            imgurl: ''
        };
    },
    computed: {},
    mounted() {
        this.userid = localStorage.getItem('vuechatid');
    },
    methods: {
        onClickLeft() {
            this.$router.push('/my');
        },
        afterRead(file) {
            this.base64Avatar = file.content;
            this.userinfo.vuechatAvatar = file.content;
        },
        editInfo() {
            // console.log(this.fileList)
            const formData = new FormData();
            if (this.base64Avatar) {
                formData.append('vuechatAvatar', this.base64Avatar);
            } else {
                formData.append('vuechatAvatar', this.userinfo.vuechatAvatar);
            }
            formData.append('vuechatName', this.userinfo.vuechatName);
            formData.append('sex', this.userinfo.sex);
            formData.append('phone', this.userinfo.phone);
            formData.append('brithday', this.userinfo.brithday);
            formData.append('address', this.userinfo.address);
            formData.append('personalSign', this.userinfo.personalSign);
            formData.append('userid', this.$store.state.userInfo._id);
            const headers = {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'multipart/form-data'
                }
            };
            const editVueChatInfoApi =
                process.env.NODE_ENV === 'development' ? '/api/user/editVueChatInfo' : '/user/editVueChatInfo';

            axios
                .post(editVueChatInfoApi, formData, headers)
                .then(res => {
                    Toast(res.data.message);
                    if (res.data.status === 2) {
                        this.$store.dispatch('getMyInfo', this.userid);
                    }
                })
                .catch(err => {
                    throw Error(err);
                });
        }
    }
};
</script>
<style lang="less" scoped>
.van-field__control:disabled {
    color: #323233;
}
</style>
