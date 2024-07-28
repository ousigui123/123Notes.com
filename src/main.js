import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import MetaInfo from 'vue-meta-info'

Vue.config.productionTip = false

Vue.use(MetaInfo)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
