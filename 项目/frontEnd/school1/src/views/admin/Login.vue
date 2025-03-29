<template>
  <div class="auth-container">
    <el-card class="auth-card">
      <template #header>
        <h2 class="card-header">高校管理员</h2>
      </template>
      
      <div class="login-title">
        <h3>管理员登录</h3>
        <p>Administrator Login</p>
      </div>

      <el-form>
        <el-form-item>
          <el-input 
            v-model="loginForm.id" 
            placeholder="管理员账号" 
            prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="loginForm.password"
            placeholder="管理员密码"
            prefix-icon="Lock"
            :type="passwordVisible ? 'text' : 'password'"
            size="large"
          >
            <template #suffix>
              <el-icon 
                class="cursor-pointer" 
                @click="togglePasswordVisibility"
                style="font-size: 18px;"
              >
                <View v-if="passwordVisible" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary"
            size="large"
            class="auth-button"
            @click="handleAdminLogin"
          >
            立即登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="auth-footer">
        <div class="auth-links">
          <p><el-link type="primary" @click="navigateToRegister">立即注册</el-link></p>
          <div class="link-spacer"></div>
          <!-- 新增返回链接 -->
          <p><el-link type="primary" @click="handleBackToUserLogin">返回校内人员登录</el-link></p>
      </div>
        <p>© {{ new Date().getFullYear() }} 管理员系统 仅限授权使用</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginAdmin ,preCheckLoginAdmin} from '../../../../../blockChain/utils/adminContract.js' // 请确保路径正确
import { useAdminStore } from '@/router/store'
const router = useRouter()
const passwordVisible = ref(false)
const adminStore = useAdminStore()

const loginForm = ref({
  id: '',
  password: ''
})

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value
}

function validateInputs() {
  if (!loginForm.value.id) {
    ElMessage.error('管理员账号不能为空')
    return false
  }
  if (!loginForm.value.password) {
    ElMessage.error('管理员密码不能为空')
    return false
  }
  return true
}

async function handleAdminLogin() {
  if (!validateInputs()) return

  try {
    const preCheckResult = await preCheckLoginAdmin(String(loginForm.value.id), String(loginForm.value.password));
    if (!preCheckResult.success) {
      if (preCheckResult.reason === "adminId not found") {
        ElMessage.error('管理员ID不存在');
      }
      if (preCheckResult.reason === "password error") {
        ElMessage.error('管理员密码错误');
      }
      return;
    }
    const result = await loginAdmin(String(loginForm.value.id), String(loginForm.value.password))
    if(result.success){
      ElMessage.success('登录成功')
      adminStore.setAdminInfo({ id: loginForm.value.id })
      router.push('/admin/main')
    }else{
      ElMessage.error('登录失败',result.reason)
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('登录失败',error.reason)
  }
}

function navigateToRegister() {
  router.push('/admin/register')
}
function handleBackToUserLogin() {
  router.push('/user/login') 
}
</script>

<style scoped lang="scss">
.auth-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/background.jpg'); // 使用统一背景图片
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.auth-card {
  width: 100%;
  max-width: 420px;

  :deep(.el-card__header) {
    padding: 0;
    border: none;
  }

  .card-header {
    padding: 20px;
    margin: 0;
    text-align: center;
    color: #f56c6c;
    font-size: 24px;
    border-bottom: 1px solid #f0f0f0;
  }
}

.login-title {
  text-align: center;
  margin-bottom: 30px;

  h3 {
    font-size: 20px;
    color: #303133;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #909399;
    margin: 0;
  }
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

.auth-button {
  width: 100%;
  margin-top: 10px;
}

.auth-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;

  .auth-links {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 12px;
    
    .link-spacer {
      width: 150px;
      height: 14px;
      margin: 0 8px;
    }

    .el-link {
      font-size: 14px;
    }
  }

  p {
    margin: 5px 0;
  }
}

@media (max-width: 480px) {
  .auth-card {
    margin: 0 10px;
  }
}
</style>