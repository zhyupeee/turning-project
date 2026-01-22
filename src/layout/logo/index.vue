<template>
  <div class="logo">
    <img src="/src/assets/images/system.png" alt="">
    <p>教学管理信息服务平台</p>
  </div>

</template>

<script setup lang="ts">

</script>
<script lang="ts">
export default {
  name: 'Logo'
}
</script>
<style scoped lang="scss">
@import '../../styles/variable.scss';

.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  overflow: hidden;
  white-space: nowrap;

  img {
    width: 40px;
    height: 40px;
    margin-left: -5px;

  }

  p {
    font-size: $base-logo-title-fontsize;
    margin-left: 10px;

  }
}
</style>