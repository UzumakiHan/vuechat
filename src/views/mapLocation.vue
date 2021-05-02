<template>
	<!-- 发表朋友圈页面 -->
	<div>
		<van-nav-bar title="选择位置" left-text="返回" left-arrow @click-left="onClickLeft">
		</van-nav-bar>
		<baidu-map :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true" style="height: 621px;width: 100%;" map-click @click="getLocation">
			<bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true">

			</bm-geolocation>
			<bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
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
				location: "",
				center: {
					lng: 0,
					lat: 0
				},
				zoom:12
			
			};
		},
		// components: {
		//     BaiduMap
		//   },
		mounted() {
		},
		methods: {
			handler({
				BMap,
				map
			}) {
				// console.log(BMap, map)
				// this.center.lng = 116.404
				// this.center.lat = 39.915
				this.BMap = BMap;
				this.zoom = 12;
				let _this = this; // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r) {
					//console.log(r);
					_this.center = {
						lng: r.longitude,
						lat: r.latitude
					}; // 设置center属性值
					// _this.autoLocationPoint = {lng: r.longitude, lat: r.latitude};   // 自定义覆盖物
					// _this.initLocation = true; 
					//console.log('center:', _this.center) // 如果这里直接使用this是不行的
				}, {
					enableHighAccuracy: true
				})
			},
			getLocation(e) {
				//console.log(e.point)
				this.center.lng = e.point.lng
				this.center.lat = e.point.lat
				// 此时已经可以获取到BMap类
				if (this.BMap) {
					const that = this
					// Geocoder() 类进行地址解析
					// 创建地址解析器的实例
					const geoCoder = new this.BMap.Geocoder()
					// getLocation() 类--利用坐标获取地址的详细信息
					// getPoint() 类--获取位置对应的坐标
					geoCoder.getLocation(e.point, function(res) {
						// console.log('获取经纬度', e.point, '获取详细地址', res)
						const addrComponent = res.addressComponents
						const surroundingPois = res.surroundingPois
						const province = addrComponent.province
						const city = addrComponent.city
						const district = addrComponent.district
						let addr = addrComponent.street
						let point = that.center
						if (surroundingPois.length > 0 && surroundingPois[0].title) {
							if (addr) {
								addr += `-${surroundingPois[0].title}`
							} else {
								addr += `${surroundingPois[0].title}`
							}
						} else {
							addr += addrComponent.streetNumber
						}
						that.location = {
							province,
							city,
							district,
							addr,
							point
							// ...that.center
						}
					//	console.log(that.location)
						that.$router.push({
							name: "PublicMoments",
							query: {
								location: JSON.stringify(that.location)
							}
						});
					})
				}

			},

			onClickLeft() {
				this.$router.go(-1)
			},


		}
	};
</script>

<style lang="less" scoped>
	.bm-view {
		width: 100%;
		height: 300px;
	}
</style>
