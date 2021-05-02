import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible/index.js'
import fastclick from 'fastclick'
import * as filters from './filter/filter.js'
import moment from 'moment'
import Vant from 'vant';
import 'vant/lib/index.css';
// import VueChatScroll from 'vue-chat-scroll'；
import BaiduMap from 'vue-baidu-map'
// Vue.use(VueChatScroll)
Vue.prototype.$moment = moment;
Vue.config.productionTip = false
// fastclick.attach(document.body)
//遍历所有导出的过滤器并添加到全局过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
})
Vue.use(Vant);
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'n0P04nkxP7LpKt7YEVhwcUXdvkh72xNI'
})
import socketio from 'socket.io-client';

import VueSocketio from 'vue-socket.io'
//  http://192.168.0.159:2120是你家后台给你的地址
Vue.use(new VueSocketio({
	debug: true,
	connection: socketio.connect('http://127.0.0.1:3000', {
		path: '',  //如果地址是wss path:"/wss"
		transports: ['websocket', 'xhr-polling', 'jsonp-polling'],
	}) 
}));  
Vue.prototype.$socketio = socketio;
// 进入路由前方法勾子
// router.beforeEach((to, from, next) => {

// //这里暂时用local、storange来简单模拟验证权限
//   if (localStorage.getItem("user")) {
//     // 如果存在，则直接跳转到对应路由
//      next();
//   } else {
//     // 如果不存在，则跳转到登录页
//     next('/login');
//   }
// });

new Vue({
  router, 
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
