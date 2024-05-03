import { createApp } from 'vue'
import App from './App.vue'
import "./style.css"

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import { router } from './router/index.js'
import { createPinia } from 'pinia'
import axios from "axios"
import mitt from 'mitt' 
import { AdminStore } from './stores/AdminStore.js'

axios.defaults.baseURL = "http://localhost:8080"  //服务器全局地址

//创建app实例
const app = createApp(App)
// 全局注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.provide("axios", axios)//方法注入(使用的名字， 真正注入的程序)
app.provide("server_url", axios.defaults.baseURL )

app.use(ElementPlus)
app.use(router)
app.use(createPinia())
app.config.globalProperties.emitter = mitt()
const adminStore = AdminStore()

//axios请求拦截器（每个axios请求 都将先被拦截 进行一些加工操作）
axios.interceptors.request.use((config) => {
    config.headers.token = adminStore.token
    return config
})


app.mount('#app')
