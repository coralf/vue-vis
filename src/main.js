import Vue from 'vue'
import App from './App.vue'
import BaiduMap from 'vue-baidu-map'
Vue.config.productionTip = false

Vue.use(BaiduMap,{
  ak:'C7PC8Ctf8eaFrf77fSXOnERB4VLq6VCM'
});
new Vue({
  render: h => h(App),
}).$mount('#app')
