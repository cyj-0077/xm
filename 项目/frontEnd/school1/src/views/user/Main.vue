<template>
  <div class="main-layout">
    <!-- 顶部导航 -->
    <el-container>
      <el-header class="main-header">
        <div class="header-left">
          <h2>用户控制台</h2>
          <el-tag type="success">普通用户</el-tag>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="30" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
              <span>{{ userStore.userInfo.name }} {{ userStore.userInfo.role }}</span>
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
            active-text-color="#67c23a"
            background-color="#fff"
            :default-active="activeMenu"
            router
          >
            <el-menu-item index="1" @click="activeMenu = '1'; router.push('/user/main/profile')">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><User /></el-icon>
                <span>留言区</span>
              </template>
              <el-menu-item index="2-1" @click="activeMenu = '2-1'; router.push('/user/main/send-message')">
                <el-icon><User /></el-icon>
                <span>发送留言</span>
              </el-menu-item>
              <el-menu-item index="2-2" @click="activeMenu = '2-2'; router.push('/user/main/view-messages')">
                <el-icon><User /></el-icon>
                <span>查看留言</span>
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
  User, ArrowDown 
} from '@element-plus/icons-vue'
import { getOutId, getUserRole } from '../../../../../blockChain/utils/userContract.js'
import { getSingleUser } from '@/utils/request'
import dayjs from 'dayjs'
import { useUserStore } from '@/router/store'

const router = useRouter()
const route = useRoute()
const activeMenu = ref(null)
const userStore = useUserStore()

async function getUserInfo() {
  try {
    const result = await getOutId(String(userStore.userInfo.id))
    const role = await getUserRole(String(userStore.userInfo.id))
    const res = await getSingleUser(result.result, role.result)

    userStore.userInfo.name = res.name
    userStore.userInfo.college = res.college
    userStore.userInfo.department = res.department
    userStore.userInfo.time = dayjs(res.time).format('YYYY-MM-DD')
    userStore.userInfo.role = role.result === 'teacher' ? '教师' : '学生'
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

getUserInfo()

// 权限验证
onMounted(() => {
  if (!userStore.userInfo.id) {
    ElMessage.error('请先登录用户账户')
    router.push('/user/login')
  }

  // 初始化 activeMenu
  if (route.path.includes('/user/main/profile')) {
    activeMenu.value = '1'
  }if (route.path.includes('/user/main/send-message')) {
    activeMenu.value = '2-1'
  }if (route.path.includes('/user/main/view-messages')) {
    activeMenu.value = '2-2'
  }

  userStore.setUserInfo(userStore.userInfo)
})

// 监听路由变化，动态设置 activeMenu
watch(route, (newRoute) => {
  if (newRoute.path.includes('/user/main/profile')) {
    activeMenu.value = '1'
  }
  if (newRoute.path.includes('/user/main/send-message')) {
    activeMenu.value = '2-1'
  }
  if (newRoute.path.includes('/user/main/view-messages')) {
    activeMenu.value = '2-2'
  }
})

// 退出登录
function handleLogout() {
  userStore.clearUserInfo()
  router.push('/user/login')
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
        color: #67c23a;
      }
    }

    .user-info {
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
