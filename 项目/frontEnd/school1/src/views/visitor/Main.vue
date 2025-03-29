<template>
  <el-container style="height: 100vh;">
    <!-- 左侧菜单 -->
    <el-aside width="200px" style="background-color: #f2f2f2;">
      <el-menu default-active="1" class="el-menu-vertical-demo">
        <el-menu-item index="1" @click="navigateToReserve">
          <i class="el-icon-date"></i>
          <span slot="title">预约功能</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧内容 -->
    <el-container>
      <el-header style="background-color: #fff; text-align: right; padding: 0 20px;">
        <span>{{ visitorName }} 游客</span>
        <el-button type="text" @click="logout" style="margin-left: 20px;">
          退出登录
        </el-button>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useVisitorStore } from '@/router/store'

// 获取游客姓名
const visitorStore = useVisitorStore()
const visitorName = computed(() => visitorStore.visitorInfo.name)

// 路由实例
const router = useRouter()

// 导航到预约页面
function navigateToReserve() {
  router.push('/visitor/main/reserve')
}

// 退出登录
function logout() {
  visitorStore.clearVisitorInfo()
  router.push('/visitor/login')
}
</script>

<style scoped>
.el-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid #ebeef5;
}

.el-aside {
  border-right: 1px solid #ebeef5;
}

.el-main {
  padding: 20px;
}
</style>
