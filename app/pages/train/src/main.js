import 'uno.css'

import '@/styles/reset.css'
import '@/styles/variables.less'
import '@/styles/global.less'
import '@/progress'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
