//vue.config.js
console.log(process.env)
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");
module.exports = {
  configureWebpack:{
    plugins: [
      sentryWebpackPlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        url:process.env.SENTRY_URL,
        // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
        // and need `project:releases` and `org:read` scopes
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }),
    ],
  },
  lintOnSave: false,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({ // 把px单位换算成rem单位
            rootValue: 37.5, // vant官方使用的是37.5
            selectorBlackList: ['vant', 'mu'], // 忽略转换正则匹配项
            propList: ['*']
          })
        ]
      }
    }
  },
  devServer: {
    proxy: {
      //以'/api'开头的接口会转接到下面的target的ip;
      '/api': {
        target: process.env.NODE_ENV==='development'?process.env.VUE_APP_DEV_HOST:process.env.VUE_APP_PRO_HOST, // target host
        changeOrigin: true, // needed for virtual hosted sites
        ws: false, // proxy websockets
        pathRewrite: {
          //路径重写
          '^/api': '', // rewrite path
        },
        logLevel: 'debug'
      },
      '/socket.io': {
        target: process.env.NODE_ENV==='development'?process.env.VUE_APP_DEV_HOST:process.env.VUE_APP_PRO_HOST, // target host
        changeOrigin: true, // needed for virtual hosted sites
        logLevel: 'debug'
      }
    },

  },

}