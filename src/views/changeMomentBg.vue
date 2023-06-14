<template>
    <div>
        <van-nav-bar
            title="更改背景"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="upload-container">
            <van-uploader
                v-model="fileList"
                :after-read="afterRead"
                :max-count="1"
                :before-delete="beforeDelete"
            />
            <van-button
                type="info"
                style=" width: 150px;margin-top: 30px"
                :disabled="isChange"
                @click="changeMomentBg"
            >
                更改
            </van-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {Toast} from 'vant';
export default {
    data() {
        return {
            fileList: [],
            base64Bg: '',
            isChange: true,
            userid: ''
        };
    },
    mounted() {
        this.userid = localStorage.getItem('vuechatid');
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },

        afterRead(file) {
            this.base64Bg = file.content;
            this.isChange = false;
        },
        beforeDelete() {
            this.fileList = [];
            this.isChange = true;
        },
        changeMomentBg() {
            // console.log(this.base64Bg)
            const formData = new FormData();
            formData.append('wechatMomentBg', this.base64Bg);
            formData.append('userid', this.userid);

            const headers = {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'multipart/form-data'
                }
            };
            const changeMomentBgApi =
                process.env.NODE_ENV === 'development' ? '/api/user/changeMomentBg' : '/user/changeMomentBg';

            axios
                .post(changeMomentBgApi, formData, headers)
                .then(res => {
                    Toast(res.data.message);
                    if (res.data.status === 2) {
                        this.$router.push('/wechatmoments');
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
.upload-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 100px;
}
.van-uploader__upload {
    background-color: #d0dfe6;
    width: 150px;
    height: 150px;
}
.van-uploader__upload-icon {
    font-size: 30px;
    color: #79bedb;
}
.van-uploader__preview-image {
    width: 150px;
    height: 150px;
}
</style>
