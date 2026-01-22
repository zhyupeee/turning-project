//小仓库：layout组件相关配置仓库

import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            fold: false, //用户控制菜单折叠还是收起
            refresh: false, //仓库这个属性用来刷新
        }
    }
})
export default useLayoutSettingStore