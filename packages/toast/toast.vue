<template>
  <div>toast</div>
</template>

<script>
export default {
  name: "toast"
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
