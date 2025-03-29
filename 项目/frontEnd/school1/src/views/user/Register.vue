<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="auth-title">
        <h2>注册新账号</h2>
        <p class="subtitle">Register a New Account</p>
      </div>

      <el-form class="register-form">
        <el-form-item>
          <el-input v-model="registerForm.id" placeholder="请输入工号" :prefix-icon="User" clearable />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="registerForm.password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            type="password"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="registerForm.confirmPassword"
            placeholder="确认密码"
            :prefix-icon="Lock"
            type="password"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="register-button" @click="register">注册</el-button>
        </el-form-item>

        <el-form-item class="centered-button">
          <el-button type="primary" class="back-to-login-button" @click="goToLogin">
            返回登录页面
          </el-button>
        </el-form-item>
      </el-form>

      <div class="register-footer">
        <p>© {{ new Date().getFullYear() }} 身份认证系统</p>
      </div>
    </div>

    <!-- 私钥展示对话框 -->
    <el-dialog v-model="dialogVisible" title="注册成功">
      <span>请妥善保管您的私钥：</span>
      <span>{{ privateKey }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false;router.push('/user/login')">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { generateKey } from '@/utils/hashPassword'
import { ElMessage } from 'element-plus'
import { registerUser } from '../../../../../blockChain/utils/userContract'

// 路由实例
const router = useRouter()

// 定义响应式数据对象
const registerForm = ref({
  id: '',
  password: '',
  confirmPassword: ''
})

const dialogVisible = ref(false)
const privateKey = ref('')

async function register() {
  // 空值检测
  if (!registerForm.value.id || !registerForm.value.password || !registerForm.value.confirmPassword) {
    ElMessage.error('所有字段均为必填项')
    return
  }

  // 密码匹配检测
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  try {
    // 生成哈希密码
    const list = await generateKey(registerForm.value.id, registerForm.value.password)
    const passwordHash = list.hashPassword
    privateKey.value = list.privateKey
    // 调用区块链注册函数
    const result = await registerUser(registerForm.value.id, passwordHash, privateKey.value)
    if (result.success) {
      dialogVisible.value = true // 确保这里被执行
      ElMessage.success('注册成功')
    } else {
      if (result.reason == 1) {
        ElMessage.error('用户已存在')
      } else if (result.reason == 2) {
        ElMessage.error('用户不存在')
      } else {
        ElMessage.error(`注册失败: ${result.reason}`)
      }
    }
  } catch (error) {
    ElMessage.error(`注册过程中出现错误: ${error.message}`)
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

.register-form {
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

.register-button {
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

.register-footer {
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