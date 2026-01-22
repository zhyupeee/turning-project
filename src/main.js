import { createApp } from 'vue'
//引入模板的全局样式
import './styles/index.scss'
import App from './App.vue'
import pinia from './store'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//引入自定义插件对象：注册整个项目全局组件
import GlobalComponent from './components/index';
// svg插件需要配置代码
import 'virtual:svg-icons-register'
//引入路由鉴权
import './permission'
const app = createApp(App)
app.use(pinia).use(GlobalComponent).use(router).use(ElementPlus, {
  locale: zhCn
}).mount('#app')