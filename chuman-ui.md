### Vue UI组件设计与封装 

### Vue组件的API主要包含三部分：props、slot、event

1. props 表示组件接收的参数，最好用对象的写法，这样可以针对每个属性设置类型、默认值或自定义校验属性的值，此外还可以通过type、validator等方式对输入进行验证
2. slot 可以给组件动态插入一些内容或组件，是实现高阶组件的重要途径；当需要多个插槽时，可以使用具名slot
3. event 是子组件向父组件传递消息的重要途径,($emit)

### props单向数据流

 父级 prop 的更新会向下流动到子组件中，但是反过来则不行，这是为了防止从子组件意外变更父级组件的状态。
1. 如果传递的prop仅仅用作展示，不涉及修改，则在模板中直接使用即可
2. 如果需要对prop的值进行转化然后展示，则应该使用computed计算属性
3. 如果prop的值用作初始化，应该定义一个子组件的data属性并将prop作为其初始值

### 组件间通信
1. 父子组件的关系可以总结为 prop 向下传递，事件event向上传递
2. 祖先组件和后代组件（跨多代）的数据传递，可以使用provide和inject来实现

### 封装一个弹窗组件
蓝湖地址：https://lanhuapp.com/web/#/item/project/board/detail?pid=19313cf3-77fa-45da-8760-42bd2f4def34&project_id=19313cf3-77fa-45da-8760-42bd2f4def34&image_id=0be7133d-4f35-406f-86a9-155648b3f93a

看设计稿分析需要传进来的prop: 
1. 控制显示与隐藏
2. 标题
3. 内容
4. 底部按钮文案（取消跟确定）
```
props:{
    // 控制显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 内容描述
    desc: {
      type: String,
      default: ''
    },
    // 取消文案
    cancelText: {
      type: String,
      default: '以后再说'
    },
    // 确定文案
    okText: {
      type: String,
      default: '我知道了'
    },
},
```

modal组件
```
<template>
  <div  class="modal_wrapper" v-show="visible">
    <div class="modal">
      <div class="modal_body">
        <div class="title"> 
            {{title}}
        </div>
        <div class="desc">
            {{desc}}
        </div>
      </div>
      <div class="modal_footer">
        <div class="btn-list">
          <div class="cancel-btn" @click="close">{{cancelText}}</div>
          <div class="confirm-btn" @click="confirm">{{okText}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='less' scoped>
.modal_wrapper{
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .modal {
    background-color: #fff;
     border-radius: .16rem;
     
    .modal_body {
      width: 5.6rem;
      padding: .5rem;
      box-sizing: border-box;
      min-height: 2.6rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .title {
        margin-bottom: .3rem;
        font-size: .32rem;
        color: #333333;
        font-weight: bold;
        line-height: .42rem;
      }
      .desc {
        font-size: .28rem;
        color: #999999;
        font-weight: bold;
        line-height: .42rem;
      }
    }
    .modal_footer{
     border-top: 1px solid #E5E5E5;
      .btn-list {
       
        display: flex;
        font-size: .32rem;
        
        align-items: center;
        .cancel-btn {
          flex: 1;
          color: #999999;
          height: 1rem;
          line-height: 1rem;
        }
        .confirm-btn {
          flex: 1;
          color: #FE5D72;
          border-left: 1px solid #E5E5E5;
          height: 1rem;
          line-height: 1rem;
        }
      }
    }
  }
}
</style>
```

使用
```
<modal @close="close" :visible="visible" title="确定拉到黑名单？" desc="拉黑后你将不再受到对方消息"></modal>

data(){
  return {
    visible: false
  }
},
methods:{
  close(value){
    this.visible = value
  },
  open(){
    this.visible = true
  }
}
```

### 使用.sync 修饰符

子组件中
```
close(){
    this.$emit('close', false)
    this.$emit('update:visible', false)
  },
```

父组件
```
<modal :visible.sync="visible" title="确定拉到黑名单？" desc="拉黑后你将不再受到对方消息"></modal>
```
上面的写法等同于
```
<modal :visible="visible" @update:visible="val => visible = val" title="确定拉到黑名单？" desc="拉黑后你将不再受到对方消息"></modal>
```

### v-model

在input元素中我们能通过v-model进行双向绑定
```
<input v-model="something">
等同于
<input :value="something" @input="something = $event.target.value">
```
既然在元素上能进行双向绑定，那在组件中进行双向绑定又如何实现，原理其实都是一样的，只是应用在自定义的组件上时，拿的并不是$event.target.value，因为我此时不作用在 Input 输入框上,拿的值应该传过来的第一个参数arguments[0]

在组件中使用v-model
```
<modal  v-model="visible" title="确定拉到黑名单？" desc="拉黑后你将不再受到对方消息"></modal>
等同于
<modal  :value="visible" @input="visible = arguments[0]" title="确定拉到黑名单？" desc="拉黑后你将不再受到对方消息"></modal>
```
那么在子组件中就要接收名字为value的prop和发送input事件
```
<template>
  <div  class="modal_wrapper" v-show="value">
    <div class="modal">
      <div class="modal_body">
        <div class="title"> 
            {{title}}
        </div>
        <div class="desc">
            {{desc}}
        </div>
      </div>
      <div class="modal_footer">
        <div class="btn-list">
          <div class="cancel-btn" @click="close">{{cancelText}}</div>
          <div class="confirm-btn" @click="confirm">{{okText}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
  export default {
    name: 'Modal',
    props:{
      // 控制显示隐藏value
      value: {
        type: Boolean,
        default: false
      },
      // 标题
      title: {
        type: String,
        default: ''
      },
      // 内容描述
      desc: {
        type: String,
        default: ''
      },
      // 取消文案
      cancelText: {
        type: String,
        default: '以后再说'
      },
      // 确定文案
      okText: {
        type: String,
        default: '我知道了'
      },
    },
    data () {
      return {
      }
    },
    methods:{
      close(){
        this.$emit('close', false)
        this.$emit('input', false)
      },
      confirm(){

      }
    }
  }
</script>
```
默认情况下，一个组件的 v-model 会使用 value 属性和 input 事件

往往有些时候，value 值被占用了，或者表单的和自定义v-model的$emit('input')事件发生冲突，为了避免这种冲突，可以定制组件 v-model

在子组件中

```
<template>
  <div  class="modal_wrapper" v-show="visible">
    <div class="modal">
      <div class="modal_body">
        <div class="title"> 
            {{title}}
        </div>
        <div class="desc">
            {{desc}}
        </div>
      </div>
      <div class="modal_footer">
        <div class="btn-list">
          <div class="cancel-btn" @click="close">{{cancelText}}</div>
          <div class="confirm-btn" @click="confirm">{{okText}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
  export default {
    name: 'Modal',
    model:{
      prop: 'visible',
      event: 'toggle'
    },
    props:{
      // 控制显示隐藏
      visible: {
        type: Boolean,
        default: false
      },
      // 标题
      title: {
        type: String,
        default: ''
      },
      // 内容描述
      desc: {
        type: String,
        default: ''
      },
      // 取消文案
      cancelText: {
        type: String,
        default: '以后再说'
      },
      // 确定文案
      okText: {
        type: String,
        default: '我知道了'
      },
    },
    methods:{
      close(){
        this.$emit('close', false)
        this.$emit('toggle', false)
      },
      confirm(){

      }
    }
  }
</script>
```

通过 model 选项的改变，把 props 从原本的value换成了visible，input触发的事件换成了toggle，解决了冲突的问题。



### 使用插槽动态替换内容

现在弹窗内容只能单单根据props传进来的文字进行修改，如果想传入一个组件或者一张图片呢， 那就要用到插槽了。

使用插槽改写
```
<template>
  <div  class="modal_wrapper" v-show="visible">
    <div class="modal">
      <div class="modal_body">
          <div class="title"> 
            <!-- 匿名插槽 -->
            <slot>
              {{title}}
            </slot>
          </div>
        <div class="desc">
           <!-- 具名插槽 -->
          <slot name="desc">{{desc}}</slot>
        </div>
      </div>
      <div class="modal_footer">
        <!-- 具名插槽 -->
        <slot name="footer">
          <div class="btn-list">
            <div class="cancel-btn" @click="close">{{cancelText}}</div>
            <div class="confirm-btn" @click="confirm">{{okText}}</div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
```
父组件使用
```
<modal v-model="visible" title="确定拉到黑名单？" desc="拉黑后你将不再受到对方消息">
    好的
    <template slot="desc">
      开通会员，每日不限匹配次数
    </template>
    <template slot="footer">
      <div class="btn">知道了</div>
    </template>
</modal>
```
匿名插槽： name 属性默认是default
具名插槽： 带有name 属性

`<template>` 元素中的所有内容都将会被传入相应名字的插槽。没有插槽名字的 `<template>` 中的内容都会被视为默认插槽的内容。



### 组件库打包

一般引用组件库有两种方式引入，一种是全部引入，一种是按需加载

我们一般采用第二种，就是可以这样加载组件
```
import { modal }  from 'chuman-ui'
Vue.use(modal)
```
按需加载的实现方式有两种：
1. 各个组件分开打包，使用时要安装babel-plugin-import 利用它实现组件按需引入（目前ant design vue 跟element-ui 都是采用这种方式）
2. 利用webpack 生产环境下的Tree-shaking(移除 JavaScript 上下文中的未引用代码), 但需要满足使用 ES2015 模块语法（即 import 和 export），webpack 目前还并没有支持 ES modules 输出格式的包，但是rollup支持打包成es module模块的包

> CommonJS是通过module.exports定义模块， require引入模块的，但在前端浏览器中并不支持该规范，webpack以及Node是采用CommonJS的规范来写的
> AMD(Asynchronous Module Definition):异步模块定义,使用时需要引入第三方的库文件：RequireJS,是运行在浏览器环境中异步加载模块，可以并行加载多个模块。
> CMD(Common Module Definition)：通用模块定义。它解决的问题和AMD规范是一样的，只不过在模块定义方式和模块加载时机上不同，CMD也需要额外的引入第三方的库文件：SeaJS
> umd：兼容CommonJS 和 AMD,能运行在浏览器和node或者webpack环境中，同时还支持window的全局变量规范
> es6 module：import和export。import命令用于输入其他模块提供的功能。export命令用于规范模块的对外接口， 浏览器还有兼容问题，需要babel编译成es5 才能使用




我们由于是基于vue-cli3 进行开发的，所以我们就采用第一种方式

1. 使用vue-cli3 创建一个项目
```
vue create chuman-ui
```
1. 创建packages文件夹用来存放组件库源码。
2. 创建组件文件，一个组件至少包括两个文件，一个index.js用来导出组件作为插件使用，一个.vue文件，用来编写组件。

modal组件下的index.js
```
import modal from './modal.vue'
modal.install = (Vue)=>{
  Vue.component(modal.name, modal)
}
export default modal
```


文件目录
![](https://note.youdao.com/yws/api/personal/file/WEB3834104fa3870fb021ea135d9bda22ac?method=download&shareKey=782e55d077eadd7e85a82e627dbd4f3f)



在packages文件新建index.js用来导出所有的组件库

packages/index.js 
```
import './index.less'
const components = []
// 遍历当前文件夹中所有.js文件 自动导入组件
const files = require.context('./',true,/\.js$/)
files.keys().forEach(path =>{
  if (path.startsWith('./index')) return
  const componentConfig = files(path) //导入组件
  // 兼容 import export 和 require module.export 两种规范
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
  install
}
```

#### require.context

传入三个参数：一个要搜索的目录，一个标记表示是否还搜索其子目录， 以及一个匹配文件的正则表达式。

require.context函数执行后返回的是一个函数,并且这个函数有3个属性：resolve, keys, id。

1. resolve (Function) -接受一个参数request,request为test文件夹下面匹配文件的相对路径,返回这个匹配文件相对于整个工程的相对路径


2. keys (Function) -返回匹配成功模块的名字组成的数组


3. id (String) -执行环境的id,返回的是一个字符串,主要用在module.hot.accept,应该是热加载?

webpack 会在构建中解析代码中的 require.context()

#### Vue.use

使用Vue.use()方法加载插件时必须提供一个install方法，在install方法中会传入Vue实例，通过Vue.component(name, component)全局注册组件

由于需要支持按需加载，所有每个组件都必须实现install方法，全局注册组件

packages/modal/index.js
```
import modal from './modal.vue'
modal.install = (Vue)=>{
  Vue.component(modal.name, modal)
}
export default modal
```

3. 新建vue.config.js配置文件，修改打包时多入口配置
```
const path =  require('path')
const fs = require('fs')
function resolve(name){
  return path.resolve(__dirname, name)
}
const entry={}
//获取packages文件夹下所有文件名
const files = fs.readdirSync(resolve('./packages'))
files.forEach(name =>{
  name = name.split('.')[0]
  entry[name] = resolve('./packages/'+ name)
})
console.log(entry)
/*
多入口打包配置
{ 
  index: 'E:\\demo\\chuman-ui\\packages\\index', 
  modal: 'E:\\demo\\chuman-ui\\packages\\modal', 
  toast: 'E:\\demo\\chuman-ui\\packages\\toast' 
}
*/
const prod = {
  css: {
    sourceMap: true,
    extract: {
        filename: 'style/[name].css'
    }
  },
  configureWebpack: {
      entry: {
          ...entry,
      },
      output: {
          filename: '[name]/index.js',
          libraryTarget: 'commonjs2',
      }
  },
  chainWebpack: config =>{
    // @ 默认指向 src 目录，这里要改成 examples
    // 另外也可以新增一个 ~ 指向 packages
    config.resolve.alias
    .set('@', path.resolve('examples'))
    .set('~', path.resolve('packages'))
    config.module.rule('js')
    .include.add(/packages/).end()
    .include.add(/examples/).end()
    .use('babel')
    .loader('babel-loader')
    .tap(options => {
      // 修改它的选项...
      return options
    })
    config.optimization.delete('splitChunks')
    config.plugins.delete('copy')
    config.plugins.delete('html')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugins.delete('hmr')
    config.entryPoints.delete('app')
  },
  outputDir: 'lib',
  productionSourceMap: false,
}
const dev = {
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
},
  chainWebpack: config =>{
    // @ 默认指向 src 目录，这里要改成 examples
    // 另外也可以新增一个 ~ 指向 packages
    config.resolve.alias
    .set('@', path.resolve('examples'))
    .set('~', path.resolve('packages'))
    config.module.rule('js')
    .include.add(/packages/).end()
    .include.add(/examples/).end()
    .use('babel')
    .loader('babel-loader')
    .tap(options => {
      // 修改它的选项...
      return options
    })
  },
  
} 
module.exports = process.env.NODE_ENV === 'production'? prod: dev
```

运行 npm run build 生产环境下会导出prod的配置 进行打包
打包后生成的文件夹目录
![](https://note.youdao.com/yws/api/personal/file/WEB1284d42eb1d4d04b976a859b2d937112?method=download&shareKey=33b41a75944c41c7939ba315903e4d1d)


在使用时候需要安装babel-plugin-import插件，利用它实现组件按需引入。（element-ui和ant design vue 目前也是采用这种方法）

```
npm install babel-plugin-import --save-dev
```
修改babel.config.js配置
```
module.exports = {
    "presets": ["@vue/app"],
    "plugins": [
        [
            "import",
            {
                "libraryName": "chuman-ui",//组件库名称
                "camel2DashComponentName": false,//是否需要驼峰转短线
                "camel2UnderlineComponentName": false//是否需要驼峰转下划线
                "style": (name) =>{ // 自动引入css
                    const cssName = name.split('/')[2];
                    return `chuman-ui/lib/style/${cssName}.css` 
                }

            }
        ],
    ]
}
```
这个插件做了什么？

```
import { modal, toast } from 'chuman-ui';
相当于
import modal from  "chuman-ui/lib/modal/index.js";
import "chuman-ui/lib/style/modal.css" 
import toast from  "chuman-ui/lib/toast/index.js";
import "chuman-ui/lib/style/toast.css"
```

插件会帮你转换成 chuman-ui/lib/xxx 的写法，这样的话就只会引入使用到组件的js和css文件，做到按需加载。

### 文档自动生成

对于 Vue 组件，一般来说需要对外暴露： props、event、slot 等接口信息
对于 UI 组件，还需要提供预览，方便快速选择合适的组件
如果使用 Markdown 撰写，虽然能写 API 文档，但是无法提供组件预览，并且手动写文档的成本也很大

使用 vue-cli-plugin-styleguidist 进行自动化文档的生成，并提供组件预览

安装：
```
npm install vue-cli-plugin-styleguidist --save-dev
```
然后在 package.json 配置下面两行命令，分别用于开发预览和部署打包
```
{
  "scripts": {
    "styleguide": "vue-styleguidist server",
    "styleguide:build": "vue-styleguidist build"
  }
}
```

在项目根目录下，创建 styleguide.config.js
```
// styleguide.config
module.exports = {
  title: 'chuman-ui',          // 文档的标题
  components: 'packages/**/*.vue', // 组件的目录
  usageMode: 'expand',                   // 是否展开用法
  exampleMode: 'expand',                 // 是否展开示例代码
  styleguideDir: 'styleguide',           // 打包的目录
  codeSplit: true,                       // 打包时是否进行分片
};
```
编写好的组件注释
```
<template>
  <div class="modal_wrapper" v-show="visible">
    <div class="modal">
      <div class="modal_body">
        <div class="title">
          <!--  @slot 匿名插槽 标题 -->
          <slot>
            {{ title }}
          </slot>
        </div>
        <div class="desc">
          <!--  @slot 具名插槽 内容描述-->
          <slot name="desc" :user="title">{{ desc }}</slot>
        </div>
      </div>
      <div class="modal_footer">
        <!--  @slot 具名插槽 底部按钮-->
        <slot name="footer">
          <div class="btn-list">
            <div class="cancel-btn" @click="close">{{ cancelText }}</div>
            <div class="confirm-btn" @click="confirm">{{ okText }}</div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import "../index.less";
export default {
  name: "Modal",
  model: {
    prop: "visible",
    event: "toggle"
  },
  props: {
    /**
     * 控制显示隐藏
     * @model
     */

    visible: {
      type: Boolean,
      default: false
    },
    /**
     * 标题
     *
     */

    title: {
      type: String,
      default: ""
    },
    /** 内容描述*/

    desc: {
      type: String,
      default: ""
    },
    /** 取消文案*/

    cancelText: {
      type: String,
      default: "以后再说"
    },
    /** 确定文案*/

    okText: {
      type: String,
      default: "我知道了"
    }
  },
  data() {
    return {
      on: false
    };
  },
  methods: {
    close() {
      /**
       * 按钮点击成功emit事件
       * @event toggle
       * @type {boolean}
       */
      this.$emit("toggle", false);
    },
    confirm() {}
  }
};
</script>

<style lang="less" scoped>
.modal_wrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .modal {
    background-color: #fff;
    border-radius: 0.16rem;

    .modal_body {
      width: 5.6rem;
      padding: 0.5rem;
      box-sizing: border-box;
      min-height: 2.6rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .title {
        margin-bottom: 0.3rem;
        font-size: 0.32rem;
        color: #333333;
        font-weight: bold;
        line-height: 0.42rem;
      }
      .desc {
        font-size: 0.28rem;
        color: #999999;
        font-weight: bold;
        line-height: 0.42rem;
      }
    }
    .modal_footer {
      border-top: 1px solid #e5e5e5;
      .btn-list {
        display: flex;
        font-size: 0.32rem;

        align-items: center;
        .cancel-btn {
          flex: 1;
          color: #999999;
          height: 1rem;
          line-height: 1rem;
        }
        .confirm-btn {
          flex: 1;
          color: #fe5d72;
          border-left: 1px solid #e5e5e5;
          height: 1rem;
          line-height: 1rem;
        }
      }
    }
  }
}
</style>
```

UI组件预览,在组件目录下新建 Readme.md文件 用```vue开头做的标识，这个插件会把这一段代码编译成vue组件，并且能够提供交互。组件开发时候可以用这个插件一边调式组件一般写文档

readme.md 文档
```
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

 ```vue

```
效果图
![](https://note.youdao.com/yws/api/personal/file/WEB88654f425698b14f380b6f3344332bfa?method=download&shareKey=d3b0f7142aa4ad4990891305d977be9a)
![](https://note.youdao.com/yws/api/personal/file/WEBcbb793ff3ab0fc39e7e4465b86e511d2?method=download&shareKey=075457ed7125905e26d3d5e00d00cca8)


### 发布到npm

发布到npm这一步比较简单，首先得注册npm账号， 然后修改packages.js配置

```
{
  "name": "chuman-ui", // 包名
  "version": "0.4.0", // 每次发布都要修改版本号
  "private": false, // 这里传到npm 必须设置false，表示是公开的包，除非给钱
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "styleguide": "vue-styleguidist server",
    "styleguide:build": "vue-styleguidist build"
  },
  "main": "lib/index/index.js", // 访问入口
  "files": [ "lib" ] //需要发布到npm的文件， 一般是打包后的文件夹
}
```

然后就是登录发布了
```
npm login

npm publish
```

  