<template>
    <!-- 发表朋友圈页面 -->
    <div>
        <van-nav-bar
            title="位置"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        />
        <baidu-map
            :center="center"
            :zoom="zoom"
            style=" width: 100%;height: 621px"
            @ready="handler"
        >
            <bm-geolocation
                anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
                :show-address-bar="true"
                :auto-location="true"
            />
            <bm-marker
                :position="center"
                :dragging="true"
                animation="BMAP_ANIMATION_BOUNCE"
            >
                <!-- <bm-label content="我爱北京天安门" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/> -->
            </bm-marker>
        </baidu-map>
    </div>
</template>

<script>
// import BaiduMap from 'vue-baidu-map/components/map/Map.vue'

export default {
    data() {
        return {
            BMap: null,
            location: '',
            center: {
                lng: 0,
                lat: 0
            },
            zoom: 12,
            latitudeAndlongitude: null
        };
    },
    // components: {
    //     BaiduMap
    //   },
    mounted() {
        this.latitudeAndlongitude = JSON.parse(this.$route.query.latitudeAndlongitude);
    },
    methods: {
        handler() {
            // console.log(BMap, map)
            this.center.lng = this.latitudeAndlongitude.lng;

            this.center.lat = this.latitudeAndlongitude.lat;
        },

        onClickLeft() {
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="less" scoped>
.bm-view {
    width: 100%;
    height: 300px;
}
</style>
