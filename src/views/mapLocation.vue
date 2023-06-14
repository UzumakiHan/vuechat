<template>
    <div>
        <van-nav-bar
            title="选择位置"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        />
        <baidu-map
            :center="center"
            :zoom="zoom"
            :scroll-wheel-zoom="true"
            style=" width: 100%;height: 621px"
            map-click
            @ready="handler"
            @click="getLocation"
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
            />
        </baidu-map>
    </div>
</template>

<script>
export default {
    data() {
        return {
            BMap: null,
            location: '',
            center: {
                lng: 0,
                lat: 0
            },
            zoom: 12
        };
    },
    methods: {
        handler({bMap}) {
            this.BMap = bMap;
            this.zoom = 12;
            const geolocation = new bMap.Geolocation();
            geolocation.getCurrentPosition(
                r => {
                    this.center = {
                        lng: r.longitude,
                        lat: r.latitude
                    };
                },
                {
                    enableHighAccuracy: true
                }
            );
        },
        getLocation(e) {
            this.center.lng = e.point.lng;
            this.center.lat = e.point.lat;
            // 此时已经可以获取到BMap类
            if (this.BMap) {
                // Geocoder() 类进行地址解析
                // 创建地址解析器的实例
                const geoCoder = new this.BMap.Geocoder();
                geoCoder.getLocation(e.point, res => {
                    const addrComponent = res.addressComponents;
                    const surroundingPois = res.surroundingPois;
                    const province = addrComponent.province;
                    const city = addrComponent.city;
                    const district = addrComponent.district;
                    let addr = addrComponent.street;
                    const point = this.center;
                    if (surroundingPois.length > 0 && surroundingPois[0].title) {
                        if (addr) {
                            addr += `-${surroundingPois[0].title}`;
                        } else {
                            addr += `${surroundingPois[0].title}`;
                        }
                    } else {
                        addr += addrComponent.streetNumber;
                    }
                    this.location = {
                        province,
                        city,
                        district,
                        addr,
                        point
                    };
                    this.$router.push({
                        name: 'PublicMoments',
                        query: {
                            location: JSON.stringify(this.location)
                        }
                    });
                });
            }
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
