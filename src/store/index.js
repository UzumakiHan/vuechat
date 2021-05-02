import Vue from 'vue'
import Vuex from 'vuex'
import {getUserInfo} from '../api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: [],
    
  },
  mutations: {
    //获取登录用户的信息
    getMyInfo(state,userinfo){
      state.userInfo = userinfo;
    }
  },
  actions: {
    //获取登录用户的信息
    getMyInfo({commit},id){
      return new Promise(async (resolve,reject)=>{
        const result = await getUserInfo(id);
      // console.log(result)
        commit('getMyInfo',result.data.userinfo)
        if(result){
          resolve(result.data.userinfo)
        }else{
          reject('err')
        }
      })
    }

  },
  modules: {
  }
})
