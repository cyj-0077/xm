<template>
  <div class="auth-container">
    <el-card class="auth-card">
      <template #header>
        <h2 class="card-header">高校管理员</h2>
      </template>
      
      <div class="register-title">
        <h3>管理员注册</h3>
        <p>Administrator Registration</p>
      </div>

      <el-form ref="registerFormRef" :model="registerForm" class="register-form">
        <el-form-item>
          <el-input 
            v-model="registerForm.id" 
            placeholder="请输入管理员ID" 
            prefix-icon="User" 
            size="large"
            clearable 
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="registerForm.password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            :type="passwordVisible ? 'text' : 'password'"
            size="large"
            clearable
          >
            <template #suffix>
              <el-icon class="cursor-pointer" @click="togglePasswordVisibility"
                style="font-size: 18px;"
              >
                <View v-if="passwordVisible" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="registerForm.confirmPassword"
            placeholder="请确认密码"
            prefix-icon="Lock"
            type="password"
            size="large"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            size="large"
            class="auth-button"
            @click="handleRegister"
          >
            立即注册
          </el-button>
        </el-form-item>
      </el-form>

      <div class="auth-footer">
        <p>已有账号？<el-link type="primary" @click="navigateToLogin">立即登录</el-link></p>
        <p>© {{ new Date().getFullYear() }} 管理员系统 仅限授权使用</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registerAdmin,preCheckRegisterAdmin } from '../../../../../blockChain/utils/adminContract.js'

const router = useRouter()

const registerForm = ref({
  id: '',
  password: '',
  confirmPassword: ''
})
const passwordVisible = ref(false)

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value
}

function validatePasswords() {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return false
  }
  return true
}

async function handleRegister() {
  // 检查所有输入框是否有内容
  if (!registerForm.value.id || !registerForm.value.password || !registerForm.value.confirmPassword) {
    ElMessage.error('所有字段均为必填项');
    return;
  }

  // 验证密码是否一致
  if (!validatePasswords()) return;

  try {
    const preCheckResult = await preCheckRegisterAdmin(String(registerForm.value.id), String(registerForm.value.password));
    if (!preCheckResult.success) {
      if (preCheckResult.reason === "adminId already exists") {
        ElMessage.error('管理员ID已存在');
      }
      return;
    }

    await registerAdmin(String(registerForm.value.id), String(registerForm.value.password));
    ElMessage.success('注册成功！');
    router.push('/admin/login');
  } catch (error) {
    console.log(error);
    ElMessage.error('执行合约时发生错误，请检查输入或网络连接');
  }
}

function navigateToLogin() {
  router.push('/admin/login')
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

.register-title {
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