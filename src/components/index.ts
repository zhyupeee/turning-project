import SvgIcon from './SvgIcon/index.vue'
//引入element-plus提供的图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//全局对象
const allGlobalComponent = { SvgIcon }
//对外暴露插件对象
export default {
  //务必叫做install用法
  //@ts-ignore
  install(app) {
    Object.keys(allGlobalComponent).forEach(key => {
      //@ts-ignore
      app.component(key, allGlobalComponent[key])
    });
    //将element-plus提供图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}