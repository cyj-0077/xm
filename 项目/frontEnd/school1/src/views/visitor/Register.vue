<template>
    <div class="auth-container">
        
        <div class="auth-box">
            <div class="auth-title">
                <h2>游客注册</h2>
                <p class="subtitle">Visitor Registration</p>
            </div>
            
            <el-form
                ref="formRef"
                :model="formData"
                class="register-form"
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
                        class="register-button"
                        @click="handleRegister"
                    >
                        {{ loading ? '注册中...' : '注册' }}
                    </el-button>
                </el-form-item>
            </el-form>

            <div class="register-options">
                <el-link type="primary" @click="handleBackToLogin">返回登录</el-link>
            </div>

            <div class="register-footer">
                <p class="copyright">© {{ new Date().getFullYear() }} Identity Authentication System</p>
                <p class="system-name">身份认证系统</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Document, User } from '@element-plus/icons-vue'
import { registerVisitor } from '@/utils/request'
const router = useRouter()
const loading = ref(false)
const formRef = ref(null)

const formData = reactive({
    identity: '',
    name: ''
})

// 处理注册
async function handleRegister() {
    if (!formData.identity.trim() || !formData.name.trim()) {
        ElMessage.warning('请填写所有信息')
        return
    }
    loading.value = true
    const res = await registerVisitor(formData)
    console.log(res)
    if(res.code==200){
        ElMessage.success('注册成功！')
        router.push('/visitor/login')
    }else{
        ElMessage.error('注册失败,该账号已存在')
    }
    loading.value = false
}

// 返回登录页
function handleBackToLogin() {
    router.push('/visitor/login')
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

.register-button {
    width: 100%;
    height: 40px;
    font-size: 16px;
    background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3));
    
    &:hover {
        background: linear-gradient(90deg, var(--el-color-primary-dark-2), var(--el-color-primary));
    }
}

.register-options {
    text-align: center;
    margin: 20px 0;

    .el-link {
        font-size: 14px;
        
        &:hover {
            text-decoration: underline;
        }
    }
}

.register-footer {
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