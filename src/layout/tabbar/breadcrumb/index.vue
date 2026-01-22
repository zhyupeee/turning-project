<template>
        <!-- 顶部左侧静态 -->
         <el-icon style="margin-right: 10px; cursor: pointer;" @click="changeIcon">
          <component :is="LayoutSettingStore.fold ? 'Fold' :'Expand'"></component>         
         </el-icon>
          <el-breadcrumb separator-icon="ArrowRight" >
            <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
              <!-- 图标 -->
               <el-icon >
                <component :is="item.meta.icon"></component>
               </el-icon>
              <!-- //面包屑匹配路由标题 -->
              <span style="margin: 0 5px;">{{item.meta.title}}</span>
            </el-breadcrumb-item>
              
          </el-breadcrumb>
</template>

<script setup lang="ts">
import {ref} from 'vue'; 
import useLayoutSettingStore from '@/store/modules/setting';
import { useRoute } from 'vue-router';
let $route = useRoute();
//获取layout配置相关仓库
let LayoutSettingStore = useLayoutSettingStore()
//点击图标方法
const changeIcon = () => {
    LayoutSettingStore.fold = !LayoutSettingStore.fold
}
</script>
<script lang="ts">
export default {
    name: 'Breadcrumb'
}
</script>
<style>

</style>