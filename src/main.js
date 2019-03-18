import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import store from './store'
import BootstrapVue from "bootstrap-vue"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import CxltToastr from "cxlt-vue2-toastr"
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
import VuejsDialog from "vuejs-dialog"
import "vuejs-dialog/dist/vuejs-dialog.min.css"
import "@/nokestyle.css"

Vue.use(BootstrapVue)

var toastrConfigs = {
  position: 'top center',
  closeButton: false,
  showDuration: 500,
  timeOut: 2000,
  hideDuration: 500,
  showMethod: 'fadeInDown',
  hideMethod: 'fadeOutUp'
}
Vue.use(CxltToastr, toastrConfigs)

var dialogConfigs = {
  okText: "確定",
  cancelText: "取消"
}
Vue.use(VuejsDialog, dialogConfigs)

if (process.env.NODE_ENV === 'production') {
  Vue.config.devtools = false
  Vue.config.productionTip = false
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
