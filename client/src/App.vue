<template>
  <div class="box">
    <router-view></router-view>
  </div>
</template>

<script setup>

</script>

<style scoped>
.box {
  height: 100%;
  /* 确保容器高度撑满整个页面 */
  /* background: url(../public/bg.jpg); */
  background: url(../public/tpeo.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

}
</style>
