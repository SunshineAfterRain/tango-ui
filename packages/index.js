

import './index.less'
const components = []
// 遍历当前文件夹中所有.js文件
const files = require.context('./',true,/\.js$/)
console.log(files.keys())  //["./index.js", "./modal/index.js", "./toast/index.js"]
files.keys().forEach(path =>{
  if (path.startsWith('./index')) return
  console.log(path)
  const componentConfig = files(path)
  console.log(componentConfig)
   /**
   * 兼容 import export 和 require module.export 两种规范
   */
  const comp = componentConfig.default || componentConfig
  components.push(comp)
})

const install = (Vue)=>{
  components.forEach(comp =>{
    Vue.use(comp)
  })
}

// 判断是否是直接引入vue文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
}


