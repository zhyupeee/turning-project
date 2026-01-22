<template>
<router-view v-slot="{Component}">
    <transition name="fade">
        <component :is="Component" v-if="flag"></component>
    </transition>
</router-view>

</template>

<script setup lang="ts">
import {ref,watch,nextTick} from 'vue'
//获取仓库数据
import useLayOutSettingStore from '@/store/modules/setting';
let layOutSettingStore = useLayOutSettingStore()
//控制组件是否销毁重建
let flag = ref(true)
//监听仓库数据变化
watch(()=>layOutSettingStore.refresh,()=>{
    flag.value = false
    nextTick(()=>{
        flag.value = true
    })
})

</script>

<style scoped>

.fade-enter-from{
    opacity: 0;
}
.fade-enter-active{
    transition: all 0.3s ease;
}
.fade-leave-to{
    opacity: 1;
}
</style>