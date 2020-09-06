import toast from './toast.vue'
toast.install = (Vue)=>{
  Vue.component(toast.name, toast)
}
export default toast