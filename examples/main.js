import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;
import { Toast } from '../src/components';
console.log(Toast)
Vue.use(Toast);

new Vue({
  render: h => h(App)
}).$mount("#app");
