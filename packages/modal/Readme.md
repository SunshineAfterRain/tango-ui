```vue
<template>
  <div id="app">
    <div @click="open">打开弹窗</div>
    <modal  v-model="visible" title="确定拉到黑名单？" desc="拉黑后你将不再受到对方消息">
      你还不是会员
      <template #desc="{ user }">
        开通会员，每日不限匹配次数a {{user}}
      </template>
      
    </modal>
  </div>
</template>
<script>
import '../index.less'
export default {  
  name: 'App',
  data(){
    return {
      visible: false
    }
  },
  methods:{
    close(){
      this.visible = false
    },
    open(){
      console.log('a')
      this.visible = true
    }
  }
}
</script>

<style lang="less" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  /deep/
  .btn {
    line-height: 1rem;
    height: 1rem;
    color: #FE5D72;
    font-size: .32rem;
  }
}
</style>

```