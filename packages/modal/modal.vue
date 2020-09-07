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
