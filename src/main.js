import Vue from 'vue'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import router from "./router"

Vue.config.productionTip = false
Vue.use(Buefy)
const formateador = new Intl.DateTimeFormat("es-MX", {
  timeStyle: "medium"
});
Vue.filter("fechaAPartirDeMilisegundos", milisegundos => {
  return formateador.format(new Date(milisegundos));
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
