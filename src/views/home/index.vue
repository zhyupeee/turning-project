<template>
  <el-card>
    <div class="box">
      <div class="bottom-1">
        <h3 class="title">{{ getTime() }}好呀{{ userStore.userName }}</h3>
        <p class="subTitle">教学管理信息服务平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottom-2">
    <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
  </div>

</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time';
let userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;
}

.bottom-1 {
  margin-top: 10px;
  margin-left: 20px;

  .title {
    font-size: 30px;
    font-weight: 900;
    margin-bottom: 30px;
  }

  .subTitle {
    font-style: italic;
    color: skyblue;
  }
}

.bottom-2 {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>