<template>
  <div>
    <WelcomeItem></WelcomeItem>
    <div class="choose">
      <nav>
        <RouterLink to="/preview" class="cheNav">主页<el-icon class="icon">
            <Right />
          </el-icon></RouterLink>
        <RouterLink to="/login" class="cheNav">登录注册<el-icon class="icon">
            <Right />
          </el-icon></RouterLink>
        <RouterLink to="/about" class="cheNav">关于此网站<el-icon class="icon">
            <QuestionFilled />
          </el-icon></RouterLink>
      </nav>
    </div>
  </div>
</template>
<script setup>
import { RouterLink } from 'vue-router'

import WelcomeItem from '../components/WelcomeItem.vue'

</script>

<style lang="scss" scoped>

  .choose {
    position: relative;
    
    nav {
      position: absolute;
      left: 38%;
      top: 280px;

      .cheNav {
        cursor: pointer;
        border-radius: 5px;
        margin-right: 30px;
        padding: 5px;
        font-size: 17px;
        color:hsla(160, 100%, 37%, 1);
        border: 1px solid #ccc;
    
        .icon {
          padding-top: 15px;
        }
      }
    }
  }
</style>
