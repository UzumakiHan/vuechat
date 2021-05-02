<template>
  <div class="about">
    <input type='tetx' v-model="cityName.name" />
    <p>{{test | filterOne}}</p>
    <p ref="myP">{{str}}</p>
    <button @click='changeMsg'>改变msg</button>
  </div>
</template>
<script>
export default {
  data(){
    return{
      str:"公众号 张培跃，关注它的人很少！",
      test:2,
      val:2,
      cityName:{
        id:1,
        name:'guangzhou'
      }
    }
  },
  created(){
    this.$nextTick(()=>{
        this.$refs.myP.innerText = "我是一只小小小小鸟，想要飞，却怎么样也飞不高！";
    });
  },
  methods:{
   async changeMsg(){
     this.str = "欢迎关注公众号 张培跃，收看更多精彩内容！";
    this.str = "我爱你中国，我亲爱的母亲！"
    await this.$nextTick();
    console.log(this.$refs.myP.innerText);
    }
  },
  watch:{
    cityName:{
      handler(newVal,oldVal){
        console.log(newVal,oldVal)
      },
      immediate:false,
      deep:true
    }
  }
}
</script>
