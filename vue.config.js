//vue.config.js
console.log(process.env)
module.exports = {
  
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
        target: process.env.NODE_ENV==='development'?process.env.VUE_DEV_HOST:process.env.VUE_PRO_HOST, // target host
        changeOrigin: true, // needed for virtual hosted sites
        ws: false, // proxy websockets
        pathRewrite: {
          //路径重写
          '^/api': '', // rewrite path
        },
        logLevel: 'debug'
      },
      '/socket.io': {
        target: process.env.NODE_ENV==='development'?process.env.VUE_DEV_HOST:process.env.VUE_PRO_HOST, // target host
        changeOrigin: true, // needed for virtual hosted sites
        logLevel: 'debug'
      }
    },

  },

}