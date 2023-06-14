<template>
    <div>
        <van-nav-bar
            title="我的应用"
            :fixed="true"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        />
        <div style="margin-top: 46px">
            <van-grid :column-num="3">
                <van-grid-item
                    v-for="(applicationItem, applicationIndex) in applicationList"
                    :key="applicationIndex"
                    :icon="applicationItem.icon"
                    :text="applicationItem.text"
                    @click="goToApplication(applicationItem.netUlr)"
                />
            </van-grid>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            applicationList: [
                {
                    icon: require('../assets/images/vue.png'),
                    text: 'Vue博客',
                    netUlr: '//42.194.193.249:6600'
                },
                {
                    icon: require('../assets/images/react.png'),
                    text: 'React博客',
                    netUlr: '//42.194.193.249:3270'
                },
                {
                    icon: require('../assets/images/Angular.png'),
                    text: 'Angular博客',
                    netUlr: '//42.194.193.249:3280'
                },
                {
                    icon: require('../assets/images/shop.png'),
                    text: '商城',
                    netUlr: '//42.194.193.249:3260/'
                },
                {
                    icon: require('../assets/images/music.png'),
                    text: '我的音乐',
                    netUlr: '//42.194.193.249:3010/'
                }
            ]
        };
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
        goToApplication(netUlr) {
            window.open(netUlr);
        }
    }
};
</script>

<style>
.van-grid-item__text {
    color: #fff !important;
}
</style>
