<template>
    <div class="auth-container">
        <div class="auth-box">
            <div class="auth-title">
                <h2>身份认证系统</h2>
                <p class="subtitle">Identity Authentication System</p>
            </div>

            <el-form class="login-form">
                <el-form-item>
                    <el-input v-model="loginForm.id" placeholder="请输入工号" :prefix-icon="User" clearable />
                </el-form-item>

                <el-form-item>
                    <el-input
                        v-model="loginForm.password"
                        placeholder="请输入密码"
                        :prefix-icon="Lock"
                        type="password"
                        clearable
                    >
                        <template #suffix>
                            <el-icon class="cursor-pointer">
                                <View />
                            </el-icon>
                        </template>
                    </el-input>
                    <div class="link-group">
                    <el-link type="primary" class="forgot-password" @click="goToForgotPassword">忘记密码？</el-link>
                    <div style="flex-grow: 1"></div> <!-- 新增的间隔元素 -->
                    <el-link type="primary" class="admin-login" @click="goToAdminLogin">管理员登入</el-link>
                    </div>
                </el-form-item>

                <div class="action-buttons">
                    <el-button type="primary" class="login-button" @click="login">登录</el-button>
                    <el-button type="primary" class="register-button" @click="goToRegister">立即注册</el-button>
                </div>

                <el-divider></el-divider>

                <el-button type="info" plain class="visitor-button" @click="goToVisitorLogin">校外用户通道</el-button>
            </el-form>

            <div class="login-footer">
                <p>© {{ new Date().getFullYear() }} 身份认证系统</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, View } from '@element-plus/icons-vue'
import { generateKey } from '@/utils/hashPassword'
import { loginUser } from '../../../../../blockChain/utils/userContract'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/router/store'
// 路由实例
const router = useRouter()

// 定义响应式数据对象
const loginForm = ref({
    id: '',
    password: ''
})

async function login() {
    // 空值检测
    if (!loginForm.value.id || !loginForm.value.password) {
        ElMessage.error('请填写所有字段')
        return
    }

    try {
        // 生成哈希密码
        const list = await generateKey(loginForm.value.id, loginForm.value.password)
        const passwordHash = list.hashPassword
        // 调用区块链登录函数
        const result = await loginUser(loginForm.value.id, passwordHash)
        if (result.success) {
            ElMessage.success('登录成功')
            const userStore = useUserStore()
            userStore.setUserInfo({ id: loginForm.value.id })
            goToMain()
        } else {
            if(result.reason==5){
                ElMessage.error('用户未注册')
            }else if(result.reason==3){
                ElMessage.error('密码错误')
            }else{
                ElMessage.error('登录失败')
            }
        }
    } catch (error) {
        ElMessage.error(`登录过程中出现错误: ${error.message}`)
    }
}

// 跳转到注册页面
const goToRegister = () => {
    router.push('/user/register')
}

// 跳转到忘记密码页面
const goToForgotPassword = () => {
    router.push('/user/resetPassword')
}
//跳转到管理员登入页面
const goToAdminLogin = () => {
    router.push('/admin/login');
}

const goToMain = () => {
    router.push('/user/main')
}

const goToVisitorLogin = () => {
    router.push('/visitor/login')
}
</script>

<style scoped lang="scss">
.auth-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-image: url('@/assets/background.jpg');
    background-size: cover;
    background-position: center;
    padding: 20px;
}

.auth-box {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.auth-title {
    margin-bottom: 20px;

    h2 {
        margin: 0;
        font-size: 28px;
    }

    .subtitle {
        color: #909399;
        font-size: 14px;
    }
}

.login-form {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;

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
    .link-group {
        display: flex;
        align-items: baseline; /* 新增 */
        justify-content: space-between;
        gap: 10px;
        margin-top: 5px;
        width: 100%; /* 新增 */
    }
    .forgot-password {
      //  display: block;
      //  text-align: right;
        font-size: 14px;
        margin-top: 5px;
    }
    .admin-login {
       // font-size: 14px; /* 添加字体大小 */
        margin-left: auto; /* 新增 */
    }
    .forgot-password, .admin-login {
        font-size: 14px;
        flex-shrink: 0; // 防止被压缩
    }
}

.action-buttons {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    width: 100%;

    .login-button,
    .register-button {
        flex: 1;
        height: 40px;
        font-size: 16px;
        border-radius: 4px;
        transition: background-color 0.3s ease;
    }

    .login-button {
        background-color: #66b1ff;
        &:hover {
            background-color: #409eff;
        }
    }

    .register-button {
        color: #fff;
        background-color: #409eff;
        border: none;

        &:hover {
            background-color: #66b1ff;
        }
    }
}

.visitor-button {
    width: 100%;
    margin-top: 10px;
    height: 40px;
    font-size: 16px;
    color: #409eff;
    border: 1px solid #409eff;
    border-radius: 4px;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
        background-color: #409eff;
        color: #fff;
    }
}

.login-footer {
    margin-top: 20px;
    color: #666;
    font-size: 14px;

    p {
        margin: 8px 0;
    }
}

// 响应式设计
@media (max-width: 768px) {
    .auth-box {
        width: 100%;
        padding: 20px;
    }
}

.cursor-pointer {
    cursor: pointer;
}
</style>