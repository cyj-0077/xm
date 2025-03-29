<template>
  <div class="main-layout">
    <!-- 顶部导航 -->
    <el-container>
      <el-header class="main-header">
        <div class="header-left">
          <h2>管理员控制台</h2>
          <el-tag type="danger">最高权限</el-tag>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="admin-info">
              <el-avatar :size="30" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
              <span>{{ adminStore.adminInfo?.id || '未登录' }}</span>
              <el-icon><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主体内容 -->
      <el-container style="height: calc(100vh - 64px);">
        <!-- 侧边栏 -->
        <el-aside width="200px" class="main-sidebar">
          <el-menu
            active-text-color="#ff7875"
            background-color="#fff"
            :default-active="activeMenu"
            router
          >
            <el-menu-item index="1" @click="activeMenu = '1'; router.push('/admin/main/dashboard')">
              <el-icon><PieChart /></el-icon>
              <span>仪表盘</span>
            </el-menu-item>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><User /></el-icon>
                <span>校内用户管理</span>
              </template>
              <el-menu-item index="2-1" @click="activeMenu = '2-1'; router.push('/admin/main/users/add')">
                <span>添加用户</span>
              </el-menu-item>
              <el-menu-item index="2-2" @click="activeMenu = '2-2'; router.push('/admin/main/users/view')">
                <span>查看用户</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <!-- 主内容区 -->
        <el-main class="main-content">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  User, PieChart, ArrowDown 
} from '@element-plus/icons-vue'
import { useAdminStore } from '@/router/store'
const router = useRouter()
const route = useRoute()
const activeMenu = ref(null)
const adminStore = useAdminStore()

// 权限验证
onMounted(() => {
  if (!adminStore.adminInfo) {
    ElMessage.error('请先登录管理员账户')
    router.push('/admin/login')
  }

  // 初始化 activeMenu
  if (route.path.includes('/admin/main/dashboard')) {
    activeMenu.value = '1'
  } else if (route.path.includes('/admin/main/users/add')) {
    activeMenu.value = '2-1'
  } else if (route.path.includes('/admin/main/users/view')) {
    activeMenu.value = '2-2'
  }
})

// 监听路由变化，动态设置 activeMenu
watch(route, (newRoute) => {
  if (newRoute.path.includes('/admin/main/dashboard')) {
    activeMenu.value = '1'
  } else if (newRoute.path.includes('/admin/main/users/add')) {
    activeMenu.value = '2-1'
  } else if (newRoute.path.includes('/admin/main/users/view')) {
    activeMenu.value = '2-2'
  }
})

// 退出登录
function handleLogout() {
  adminStore.clearAdminInfo()
  router.push('/admin/login')
}
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;
  background: #f5f7fa;

  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

      h2 {
        margin: 0;
        color: #f56c6c;
      }
    }

    .admin-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
  }

  .main-sidebar {
    height: 100%;
    background: #fff;
    border-right: 1px solid #e4e7ed;
  }

  .main-content {
    padding: 20px;
  }
}
</style>
