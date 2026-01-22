<template>
  <div>
    <div class="layout_container">
      <!-- 左侧菜单 -->
      <div class="layout_slider" :class="{ fold: LayoutSettingStore.fold }">
        <logo></logo>
        <!-- 展示菜单 -->
        <el-scrollbar class="scrollbar">
          <!-- 菜单组件 -->
          <el-menu :default-active="$router.currentRoute.value.path" background-color="#001529" text-color="#fff">
            <!-- 根据路由动态生成菜单 -->
            <Menu :menu-list="menuList"></Menu>
          </el-menu>

        </el-scrollbar>
      </div>
      <div class="layout_tabbar" :class="{ fold: LayoutSettingStore.fold }">
        <!-- 顶部导航 -->
        <Tabbar></Tabbar>
      </div>
      <div class="layout_main" :class="{ fold: LayoutSettingStore.fold }">
        <Main></Main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
//引入左侧菜单子组件
import logo from './logo/index.vue'
//引入菜单组件
import Menu from './menu/index.vue'
//右侧展示区域
import Main from './main/index.vue'
//引入tabbar组件
import Tabbar from './tabbar/index.vue'

//获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
//获取layout配置相关仓库
import useLayoutSettingStore from '@/store/modules/setting'

// 创建简易菜单列表
const menuList = [
  {
    path: '/home',
    meta: {
      title: '首页',
      icon: 'HomeFilled',
      hidden: false
    },
    children: []
  },
  {
    path: '/course',
    meta: {
      title: '课程资源管理',
      icon: 'Document',
      hidden: false
    },
    children: [
      {
        path: '/category',
        meta: {
          title: '课程分类管理',
          icon: 'Folder',
          hidden: false
        }
      },
      {
        path: '/data',
        meta: {
          title: '课程数据管理',
          icon: 'DataLine',
          hidden: false
        }
      }
    ]
  },
  {
    path: '/selection',
    meta: {
      title: '选课与学习记录管理',
      icon: 'Clock',
      hidden: false
    },
    children: []
  },
  {
    path: '/evaluation',
    meta: {
      title: '课程评价管理',
      icon: 'Star',
      hidden: false
    },
    children: []
  }
]

let userStore = useUserStore()
let $router = useRouter()
//获取layout配置相关仓库
let LayoutSettingStore = useLayoutSettingStore()
</script>
<script setup>
export default {
  name: 'Layout'
}
</script>

<style lang="scss">
@import '../styles/variable.scss';

.layout_container {
  width: 100%;
  height: 100vh;
}

.layout_slider {
  color: white;
  width: $base-menu-width;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: $base-menu-background;
  transition: all 0.3s;

  .scrollbar {
    width: 100%;
    height: 100vh-$base-menu-logo-height;

    .el-menu {
      border-right: none;
      height: 100%;
      min-height: 100%;
    }
  }

  &.fold {
    width: $base-menu-min-width;
  }
}

.layout_tabbar {
  position: fixed;
  width: calc(100% - $base-menu-width);
  height: $base-tabbar-height;
  top: 0;
  left: $base-menu-width;
  transition: all 0.3s;

  &.fold {
    width: calc(100vw - $base-menu-min-width);
    left: $base-menu-min-width;

  }
}

.layout_main {
  position: absolute;
  width: calc(100% - $base-menu-width);
  height: calc(100vh - $base-tabbar-height);
  top: $base-tabbar-height;
  left: $base-menu-width;
  padding: 20px;
  transition: all 0.3s;

  &.fold {
    width: calc(100vw - $base-menu-min-width);
    left: $base-menu-min-width;

  }
}
</style>
