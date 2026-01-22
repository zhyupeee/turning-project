<template>
  <template v-for="(item, index) in menuList" :key="index">
    <!-- 没有子路由或空数组 -->
    <template v-if="!item.children || item.children.length === 0">
      <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
        <el-icon>
          <component :is="iconMap[item.meta.icon]"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 有子路由 -->
    <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 0">

      <template #title>
        <el-icon>
          <component :is="iconMap[item.meta.icon]"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menu-list="item.children"></Menu>
    </el-sub-menu>
  </template>

</template>


<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Document, Folder, DataLine, Clock, Star, HomeFilled } from '@element-plus/icons-vue';

//获取父组件传递过来的全部路由数组
defineProps(['menuList']);

// 图标映射
const iconMap: Record<string, any> = {
  'Document': Document,
  'Folder': Folder,
  'DataLine': DataLine,
  'Clock': Clock,
  'Star': Star,
  'HomeFilled': HomeFilled
};

//获取路由器对象
let $router = useRouter();
//点击菜单的回调
const goRoute = (vc: any) => {
  //路由跳转
  $router.push(vc.index);
}
</script>
<script lang="ts">
export default {
  name: 'Menu'
}
</script>


<style scoped>
.el-menu {
  border-right: none;
}

.el-menu-item,
.el-sub-menu__title {
  height: 50px;
  line-height: 50px;
  padding-left: 20px !important;
}

.el-menu-item:hover,
.el-sub-menu__title:hover {
  background-color: #1890ff !important;
}
</style>