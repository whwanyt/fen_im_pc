import { createApp } from 'vue'
import NaiveUI from 'naive-ui'
import { pinia } from './store/index'
import App from './App.vue'
import { router } from './router'
createApp(App).use(pinia).use(NaiveUI).use(router).mount('#app')
