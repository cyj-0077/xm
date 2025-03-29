<template>
    <div class="auth-container">
        
        <div class="auth-box">
            <div class="auth-title">
                <h2>游客通道</h2>
                <p class="subtitle">Visitor Channel</p>
            </div>
            
            <el-form
                ref="formRef"
                :model="formData"
                class="login-form"
            >
                <el-form-item>
                    <el-input
                        v-model="formData.identity"
                        placeholder="请输入身份证明（身份证/护照/其他证件）"
                        :prefix-icon="Document"
                        clearable
                    />
                </el-form-item>

                <el-form-item>
                    <el-input
                        v-model="formData.name"
                        placeholder="请输入姓名"
                        :prefix-icon="User"
                        clearable
                    />
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        :loading="loading"
                        class="login-button"
                        @click="handleLogin"
                    >
                        {{ loading ? '登录中...' : '登录' }}
                    </el-button>
                </el-form-item>
            </el-form>

            <div class="login-options">
                <el-link type="primary" @click="handleBackToLogin">返回校内人员登录</el-link>
                <el-divider></el-divider>
                <el-button 
                    type="info" 
                    plain 
                    class="visitor-button" 
                    @click="handleToRegister"
                >
                    <el-icon><Plus /></el-icon>
                    游客注册
                </el-button>
            </div>

            <div class="login-footer">
                <p class="copyright">© {{ new Date().getFullYear() }} Identity Authentication System</p>
                <p class="system-name">身份认证系统</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Document, User, Plus } from '@element-plus/icons-vue'
import { loginVisitor } from '@/utils/request'
import { useVisitorStore } from '@/router/store'
const router = useRouter()
const loading = ref(false)
const visitorStore = useVisitorStore()
const formData = ref({
    identity: '',
    name: ''
})

// 处理登录
async function handleLogin() {
    if (!formData.value.identity.trim() || !formData.value.name.trim()) {
        ElMessage.warning('请填写所有信息')
        return
    }
    loading.value = true
    const res = await loginVisitor(formData.value)
    if(res.code==200){
        ElMessage.success('登录成功！')
        visitorStore.setVisitorInfo(formData.value)
        router.push('/visitor/main')
    }else{
        ElMessage.error(res.response.data.error)
    }
    loading.value = false
}

// 返回登录页
function handleBackToLogin() {
    router.push('/user/login')
}

// 前往注册页
function handleToRegister() {
    router.push('/visitor/register')
}
</script>

<style scoped lang="scss">
.auth-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f0f2f5;
    background-image: url('@/assets/background.jpg');
    background-size: cover;
    background-position: center;
}

.site-logo img {
    width: 120px;
    margin-bottom: 20px;
}

.auth-box {
    width: 400px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.auth-title {
    text-align: center;
    margin-bottom: 20px;

    h2 {
        font-size: 24px;
        margin: 0;
    }

    .subtitle {
        font-size: 14px;
        color: #909399;
    }
}

.login-button {
    width: 100%;
    height: 40px;
    font-size: 16px;
    background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3));
    
    &:hover {
        background: linear-gradient(90deg, var(--el-color-primary-dark-2), var(--el-color-primary));
    }
}

.login-options {
    text-align: center;
    margin: 20px 0;

    .el-link {
        font-size: 14px;
        
        &:hover {
            text-decoration: underline;
        }
    }

    .el-divider {
        margin: 16px 0;
        color: #909399;
    }

    .visitor-button {
        width: 100%;
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: linear-gradient(to right, #95c7f3, #abc9f0);
        border: none;
        color: #fff;
        transition: all 0.3s ease;
        
        .el-icon {
            margin-right: 4px;
            font-size: 16px;
        }
        
        &:hover {
            background: linear-gradient(to right, #7ab3ef, #95c7f3);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
    }
}

.login-footer {
    margin-top: 35px;
    text-align: center;
    
    .copyright {
        font-size: 13px;
        color: #909399;
        margin-bottom: 6px;
        font-family: 'Arial', sans-serif;
    }
    
    .system-name {
        font-size: 14px;
        color: #606266;
        font-weight: 500;
        letter-spacing: 1px;
    }
}
</style> 