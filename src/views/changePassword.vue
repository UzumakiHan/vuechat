<template>
    <div>
        <van-nav-bar
            title="更改密码"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        />
        <van-steps :active="active">
            <van-step>输入原来的密码</van-step>
            <van-step>输入更改的密码</van-step>
            <van-step>确定密码</van-step>
        </van-steps>
        <div
            class="inputs-div"
            style="margin-top: 20px"
        >
            <van-field
                v-if="active === 0"
                v-model="originPwd"
                placeholder="请输入原来的密码"
                type="password"
            />
            <van-field
                v-if="active === 1"
                v-model="newPwd"
                placeholder="请输入更改的密码"
                type="password"
            />
            <van-field
                v-if="active === 2"
                v-model="finalPwd"
                placeholder="请确定密码"
                type="password"
            />
        </div>
        <div style="display: flex; justify-content: flex-end; padding: 10px">
            <van-button
                v-if="active !== 0"
                type="default"
                @click="prevStep"
            >
                上一步
            </van-button>
            <van-button
                v-if="active !== 2"
                type="info"
                style="margin-left: 6px"
                @click="nextStep"
            >
                下一步
            </van-button>
            <van-button
                v-if="active === 2 && active !== 0"
                type="info"
                style="margin-left: 6px"
                @click="sureChangePwd"
            >
                确定
            </van-button>
        </div>
    </div>
</template>

<script>
import md5 from 'js-md5';
import {Toast} from 'vant';
import {changeUserPwd} from '../api';
export default {
    data() {
        return {
            userid: '',
            userinfo: null,
            active: 0,
            originPwd: '',
            newPwd: '',
            finalPwd: ''
        };
    },
    mounted() {
        this.userinfo = this.$store.state.userInfo;
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
        nextStep() {
            if (this.active === 0) {
                if (md5(this.originPwd) === this.userinfo.vuechatPassword) {
                    this.active += 1;
                } else {
                    Toast('密码不一致');
                }
            } else if (this.active === 1) {
                if (this.newPwd === '') {
                    Toast('输入不能为空');
                } else {
                    this.active += 1;
                }
            }
        },
        prevStep() {
            this.active -= 1;
        },
        async sureChangePwd() {
            if (this.finalPwd === this.newPwd) {
                const changeInfo = {
                    id: this.userid,
                    changePwd: this.finalPwd
                };
                const result = await changeUserPwd(changeInfo);
                Toast(result.data.message);
                if (result.data.status === 2) {
                    localStorage.removeItem('vuechatid');
                    localStorage.removeItem('vuechattoken');
                    this.$router.push('/login');
                }
            } else {
                Toast('密码不一致');
            }
        }
    }
};
</script>
