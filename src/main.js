import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible/index.js'
import * as filters from './filter/filter.js'
import moment from 'moment'
import Vant from 'vant';
import 'vant/lib/index.css';
// import VueChatScroll from 'vue-chat-scroll'；
import BaiduMap from 'vue-baidu-map'
import * as Sentry from "@sentry/vue";
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
const socketHost = process.env.NODE_ENV==='development'?process.env.VUE_APP_DEV_HOST:process.env.VUE_APP_PRO_HOST
Vue.use(new VueSocketio({
	debug: true,
	connection: socketio.connect(socketHost, {
		path: '',  //如果地址是wss path:"/wss"
		transports: ['websocket', 'xhr-polling', 'jsonp-polling'],
	}) 
}));  
Vue.prototype.$socketio = socketio;
Vue.prototype.$socketHost = socketHost;
if(process.env.NODE_ENV === 'production'){
  Sentry.init({
    Vue,
    dsn: "https://401437aff7c04bd7b96cca8636039506@o4505344036110336.ingest.sentry.io/4505352620212224",
    integrations: [
      new Sentry.BrowserTracing({
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

new Vue({
  router, 
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
