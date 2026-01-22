<template>
  <el-button type="primary" size="default" icon="Refresh" circle @click="updateRefresh"></el-button>
  <el-button type="primary" size="default" icon="FullScreen" circle @click="fullScreen"></el-button>

  <el-popover placement="bottom" title="主题设置" :width="300" trigger="click">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker @change="setColor" v-model="color" show-alpha :predefine="predefineColors" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch @change="changeDark" v-model="dark"  :active-icon="MoonNight" :inactive-icon="Sunny" class="mt-2"
          style="margin-left: 24px" inline-prompt />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button type="primary" size="default" icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img src="@/assets/images/avatar.png" alt="" style="width: 24px;height: 24px;margin: 0 10px;border-radius: 50%;" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.userName }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, } from 'vue-router'
//获取用户相关小仓库
import useUserStore from '@/store/modules/user'
//获取骨架的小仓库
import useLayOutSettingStore from '@/store/modules/setting';
import { MoonNight, Sunny } from '@element-plus/icons-vue';
//获取路由对象
let $router = useRouter()
let $route = useRoute()
//暗黑模式
const dark = ref(false)

const LayoutSettingStore = useLayOutSettingStore()
const userStore = useUserStore()
//刷新按钮点击回调
const updateRefresh = () => {
  LayoutSettingStore.refresh = !LayoutSettingStore.refresh
}
//全屏回调
const fullScreen = () => {
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
//退出登录
const logout = async () => {
  //第一件事情:需要向服务器发请求[退出登录接口]******//
  // 第二件事情:仓库当中关于用于相关的数据清空[token|username|avatar]
  //第三件事情:跳转到登录页面
  await userStore.userLogout()
  //第四件事情:跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
//切换暗黑模式
const changeDark = ()=> {
  //获取HTML根节点
  const html = document.documentElement
  //切换暗黑模式
  if (dark.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}
const setColor = ()=> {
  //获取HTML根节点
  const html = document.documentElement
  //设置主题颜色
  html.style.setProperty('--el-color-primary', color.value)
}
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
</script>
<script lang="ts">
export default {
  name: 'Setting'
}
</script>
<style></style>
