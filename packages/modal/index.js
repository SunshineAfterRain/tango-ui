import modal from './modal.vue'
modal.install = (Vue)=>{
  Vue.component(modal.name, modal)
}
export default modal