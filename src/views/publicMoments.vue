<template>
    <!-- 发表朋友圈页面 -->
    <div @click="faceShow = false">
        <van-nav-bar
            title="发表朋友圈"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        >
            <template v-slot:right>
                <van-button
                    type="primary"
                    size="small"
                    :disabled="isDisabled"
                    @click="publicMoment"
                >
                    发表
                </van-button>
            </template>
        </van-nav-bar>
        <div class="edit-box">
            <van-field
                ref="textareaRef"
                v-model="momentText"
                rows="6"
                autosize
                type="textarea"
                placeholder="这一刻的想法....."
                @input="inputMomentText"
            />
            <div class="face-box">
                <van-icon
                    name="smile-o"
                    style="margin-right: 5px"
                    size="24"
                    @click.stop="faceContent"
                />
            </div>
            <div class="upload-box">
                <van-uploader
                    v-model="imgList"
                    multiple
                    :max-count="2"
                    :after-read="uploadImg"
                />
            </div>
        </div>

        <div class="local-box">
            <van-cell
                value=""
                is-link
                to="maplocation"
            >
                <!-- 使用 title 插槽来自定义标题 -->
                <template v-slot:title>
                    <van-icon
                        name="location-o"
                        size="18"
                    />
                    <span class="custom-title">{{ location || '所在位置' }}</span>
                </template>
            </van-cell>
        </div>
        <!-- 表情区域部分 -->
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
    </div>
</template>

<script>
// import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import {Dialog, Toast} from 'vant';

import axios from 'axios';
const emojData = require('@/assets/emojis.json');

export default {
    data() {
        return {
            isDisabled: true, // 控制按钮的高亮
            momentText: '', // 朋友圈文本
            imgList: [],
            faceShow: false,
            faceList: [],
            userid: '',
            location: '',
            base64ImgList: [],
            latitudeAndlongitude: null
        };
    },

    activated() {
        this.userid = localStorage.getItem('vuechatid');
        if (this.$route.query.location) {
            const location = JSON.parse(this.$route.query.location);
            this.location = location.addr;
            this.latitudeAndlongitude = location.point;
        }
    },
    methods: {
        onClickLeft() {
            // this.$router.go(-1)
            Dialog.confirm({
                title: '',
                message: '退出此编辑？'
            }).then(() => {
                // on confirm
                this.momentText = '';
                this.imgList = [];
                this.location = '';
                this.$router.push('/wechatmoments');
            });
        },
        // 输入框输入
        inputMomentText() {
            this.isDisabled = this.momentText === '';
        },
        faceContent() {
            this.faceShow = !this.faceShow;
            this.faceList = [];
            this.$refs.textareaRef.foucs();
            if (this.faceShow === true) {
                for (const i in emojData) {
                    this.faceList.push(emojData[i].char);
                }
            }
        },
        // 表情评论
        getBrow(index) {
            for (const i in this.faceList) {
                if (index === i) {
                    this.momentText += this.faceList[index];
                }
            }
        },
        uploadImg() {
            this.isDisabled = false;
        },
        // 发表朋友圈
        async publicMoment() {
            const formData = new FormData();
            this.imgList.forEach((item, index) => {
                this.base64ImgList.push(item.content);
                formData.append(`base64ImgList${index}`, item.content);
            });
            formData.append('vueChatId', this.userid);
            formData.append('momentText', this.momentText);
            formData.append('momentTime', new Date());
            formData.append('base64ImgListLength', this.base64ImgList.length);
            formData.append('location', this.location);
            formData.append('latitudeAndlongitude', JSON.stringify(this.latitudeAndlongitude));
            const headers = {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'multipart/form-data'
                }
            };
            const publicMomentApi =
                process.env.NODE_ENV === 'development'
                    ? '/api/wechatmoment/publicMoment'
                    : '/wechatmoment/publicMoment';
            axios
                .post(publicMomentApi, formData, headers)
                .then(res => {
                    this.momentText = '';
                    this.imgList = [];
                    this.location = '';
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
.edit-box {
    padding: 6px 0px;
    background: #fff;

    .upload-box {
        margin-top: 8px;
        padding: 0 16px;
    }
}

.local-box {
    margin-top: 10px;
}

.van-cell__title {
    display: flex;
    align-items: center;
}

.face-box {
    margin-top: 8px;
    padding: 0 16px;
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

.bm-view {
    width: 100%;
    height: 300px;
}
</style>
