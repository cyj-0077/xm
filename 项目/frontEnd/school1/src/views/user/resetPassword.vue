<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="auth-title">
        <h2>重置密码</h2>
        <p class="subtitle">Reset Password</p>
      </div>

      <el-form class="reset-password-form">
        <el-form-item>
          <el-input v-model="resetForm.id" placeholder="请输入工号" :prefix-icon="User" clearable />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="resetForm.privateKey"
            placeholder="请输入私钥"
            :prefix-icon="Key"
            type="password"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="resetForm.newPassword"
            placeholder="请输入新密码"
            :prefix-icon="Lock"
            type="password"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="resetForm.confirmNewPassword"
            placeholder="确认新密码"
            :prefix-icon="Lock"
            type="password"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="reset-button" @click="setNewPassword">确认</el-button>
        </el-form-item>

        <el-form-item class="centered-button">
          <el-button type="primary" class="back-to-login-button" @click="goToLogin">
            返回登录页面
          </el-button>
        </el-form-item>
      </el-form>

      <div class="reset-footer">
        <p>© {{ new Date().getFullYear() }} 身份认证系统</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { generateKey } from '@/utils/hashPassword'
import { resetPassword } from '../../../../../blockChain/utils/userContract'
// 路由实例
const router = useRouter()

// 定义响应式数据对象
const resetForm = ref({
  id: '',
  privateKey: '',
  newPassword: '',
  confirmNewPassword: ''
})

async function setNewPassword() {
  // 空值检测
  if (!resetForm.value.id || !resetForm.value.privateKey || !resetForm.value.newPassword || !resetForm.value.confirmNewPassword) {
    ElMessage.error('所有字段均为必填项')
    return
  }

  // 新密码匹配检测
  if (resetForm.value.newPassword !== resetForm.value.confirmNewPassword) {
    ElMessage.error('两次输入的新密码不一致')
    return
  }

  try {
    const list = await generateKey(resetForm.value.id, resetForm.value.newPassword)
    const passwordHash = list.hashPassword
    const result = await resetPassword(resetForm.value.id,resetForm.value.privateKey , passwordHash)
    if (result.success) {
      ElMessage.success('密码重置成功') // 模拟成功消息
      router.push('/user/login')
    } else if (result.reason == 2) {
      ElMessage.error('用户不存在')
    } else if (result.reason == 4) {
      ElMessage.error('私钥错误')
    } else {
      ElMessage.error(`重置密码过程中出现错误: ${result.reason}`)
    }
  } catch (error) {
    ElMessage.error(`重置密码过程中出现错误: ${error.message}`)
  }
}


// 跳转到登录页面
const goToLogin = () => {
  router.push('/user/login')
}
</script>

<style scoped lang="scss">
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
}

.auth-box {
  background-color: rgba(255, 255, 255, 0.9); /* 半透明背景 */
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
}

.auth-title {
  text-align: center;
  margin-bottom: 30px;

  h2 {
    margin: 0;
    font-size: 28px;
  }

  .subtitle {
    color: #909399;
    font-size: 14px;
  }
}

.reset-password-form {
  .el-input {
    --el-input-hover-border: var(--el-color-primary);
  }

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #dcdfe6 inset;

    &:hover {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset;
    }
  }

  .centered-button {
    display: flex;
    justify-content: center;
    width: 100%; /* 确保按钮容器占满宽度 */
    margin-top: -10px; /* 调整间距以更好地居中 */
  }
}

.reset-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.back-to-login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  color: #fff;
  background-color: #409eff;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #66b1ff;
  }
}

.reset-footer {
  margin-top: 24px;
  text-align: center;
  color: #666;
  font-size: 14px;

  p {
    margin: 8px 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .auth-box {
    width: 90%;
    max-width: 400px;
    padding: 20px;
  }
}
</style>
