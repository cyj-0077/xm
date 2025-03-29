<template>
    <div class="circle-container">
        <el-container>
            <el-main class="main">
                <el-row :gutter="20">
                    <!-- 左侧留言区 -->
                    <el-col :span="16">
                        <el-card class="message-card" shadow="hover">
                            <template #header>
                                <div class="card-header">
                                    <span>留言区</span>
                                </div>
                            </template>
                            <div class="content">
                                <!-- 选择接收者 -->
                                <el-form>
                                    <el-form-item>
                                        <el-radio-group v-model="messageForm.receiverRole" size="default">
                                            <el-radio-button :value="'teacher'">教师</el-radio-button>
                                            <el-radio-button :value="'student'">学生</el-radio-button>
                                        </el-radio-group>
                                    </el-form-item>

                                    <el-form-item>
                                        <el-select v-model="messageForm.receiverOutId" placeholder="选择接收者" filterable>
                                            <el-option
                                                v-for="user in filteredReceivers"
                                                :key="user.id"
                                                :label="`${user.name} - ${user.college} - ${user.department}`"
                                                :value="user.id"
                                            />
                                        </el-select>
                                    </el-form-item>

                                    <!-- 留言内容 -->
                                    <el-form-item>
                                        <el-input v-model="messageForm.content" type="textarea" :rows="6" placeholder="请输入留言内容" />
                                    </el-form-item>

                                    <el-form-item>
                                        <el-button type="primary" @click="handleSendMessage">发送留言</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getTeachers, getStudents, sendMessage } from '@/utils/request'
import { useUserStore } from '@/router/store'
import { ElMessage } from 'element-plus'
import { getOutId, getUserRole, getUserId, receiveMessage } from '../../../../../blockChain/utils/userContract'

const userStore = useUserStore()

const messageForm = ref({
    receiverRole: '',
    receiverOutId: '',
    content: ''
})
const userRole = ref('')
const teachersMap = ref({})
const studentsMap = ref({})

// 获取当前用户的数据库ID
let currentUserId = null
async function fetchCurrentUserId() {
    try {        
        const result = await getOutId(userStore.userInfo.id)
        currentUserId = result.result
        const role = await getUserRole(userStore.userInfo.id)
        userRole.value = role.result
    } catch (error) {
        console.error('获取当前用户ID失败:', error)
    }
}

// 过滤后的接收者列表
const filteredReceivers = computed(() => {
    const list = messageForm.value.receiverRole === 'teacher' ? Object.values(teachersMap.value) : Object.values(studentsMap.value);
    return messageForm.value.receiverRole ? list : [];
})

// 监听 receiverRole 的变化，清空 receiverName
watch(() => messageForm.value.receiverRole, () => {
    messageForm.value.receiverOutId = ''
})

// 获取教师列表
async function fetchTeachers() {
    try {
        const data = await getTeachers()
        data.forEach(teacher => {
            if (userRole.value === 'teacher') {
                if (String(teacher.id) !== String(currentUserId)) {
                    teachersMap.value[teacher.id] = teacher
                }
            } else {
                teachersMap.value[teacher.id] = teacher
            }
        })
    } catch (error) {
        console.error('获取教师列表失败:', error)
    }
}

// 获取学生列表
async function fetchStudents() {
    try {
        const data = await getStudents()
        data.forEach(student => {
            if (userRole.value === 'student') {
                if (String(student.id) !== String(currentUserId)) {
                    studentsMap.value[student.id] = student
                }
            } else {
                studentsMap.value[student.id] = student
            }
        })
    } catch (error) {
        console.error('获取学生列表失败:', error)
    }
}

// 初始化数据
onMounted(async () => {
    await fetchCurrentUserId()
    await fetchTeachers()
    await fetchStudents()
})

async function handleSendMessage() {
    if (!messageForm.value.receiverRole || !messageForm.value.receiverOutId || !messageForm.value.content) {
        ElMessage.error('请填写所有必填字段')
        return
    }

    try {
        const receiverName = messageForm.value.receiverRole === 'teacher' ? teachersMap.value[messageForm.value.receiverOutId].name : studentsMap.value[messageForm.value.receiverOutId].name;
        const res = await sendMessage(userStore.userInfo.name, messageForm.value.content, receiverName);
        const result1 = await getUserId(String(messageForm.value.receiverOutId))
        const receiverUserId = result1.result
        const result2 = await receiveMessage(String(res.messageId), String(userStore.userInfo.id), String(receiverUserId))
        
        if (result2.success) {
            ElMessage.success('留言发送成功')
        } else {
            ElMessage.error('留言发送失败')
        }
    } catch (error) {
        console.error('留言发送失败:', error);
    }
}
</script>

<style scoped lang="scss">
.circle-container {
    min-height: 100%;
    background-color: #f0f2f5;

    .main {
        padding: 20px;

        .message-card {
            height: 100%;
            overflow-y: auto;

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0;

                span {
                    font-size: 16px;
                    font-weight: 600;
                    color: #1f2f3d;
                }
            }

            .content {
                padding: 20px;
                font-size: 14px;
                color: #606266;
            }
        }
    }
}
</style>