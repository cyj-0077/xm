<template>
    <div class="view-messages">
      <el-card class="message-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>查看留言</span>
          </div>
        </template>
        <el-table :data="messages" style="width: 100%">
          <el-table-column prop="senderId" label="学号" width="180" />
          <el-table-column prop="senderName" label="发送者" width="180" />
          <el-table-column prop="senderCollege" label="学院" width="180" />
          <el-table-column prop="senderDepartment" label="系别" width="180" />
          <el-table-column label="内容">
            <template #default="scope">
              <el-button type="primary" @click="viewContent(scope.row)">
                查看内容
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag
                :type="scope.row.isRead ? 'success' : 'info'"
                @click="!scope.row.isRead && toggleReadStatus(scope.row)"
                style="cursor: pointer;"
              >
                {{ scope.row.isRead ? '已读' : '未读' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import { getSingleUser,getMessagesByMessageId,setMessageRead } from '@/utils/request'
  import { getMessagesByReceiver, getUserRole,getOutId } from '../../../../../blockChain/utils/userContract'
  import { useUserStore } from '@/router/store'
  
  const messages = ref([])
  const userStore = useUserStore()
  
  async function fetchMessages() {
    try {
      const result = await getMessagesByReceiver(userStore.userInfo.id)
      const messageIds = result.result[0]
      const senderIds = result.result[1]

      messageIds.forEach(async (element, index) => {
        const result = await getMessagesByMessageId(element)
        const role = await getUserRole(senderIds[index])
        const outId = await getOutId(senderIds[index])
        const res = await getSingleUser(parseInt(outId.result),role.result)
        messages.value.push({
          senderId: senderIds[index],
          senderName: res.name+(role.result=="teacher"?"教师":"学生"),
          senderCollege: res.college,
          senderDepartment: res.department,
          messageContent: result.message.messageContent,
          isRead: result.message.isRead,
          messageId: element
        })
      });
    } catch (error) {
      console.error('获取消息失败:', error)
    }
  }
  
  function viewContent(row) {
    ElMessageBox.alert(row.messageContent, '留言内容', {
      confirmButtonText: '确定'
    })
  }
  
  async function toggleReadStatus(row) {
    await setMessageRead(row.messageId,!row.isRead)
    window.location.reload()
  }
  
  onMounted(() => {
    fetchMessages()
  })
  </script>
  
  <style scoped>
  .view-messages {
    padding: 20px;
  }
  
  .card-header {
    font-size: 18px;
    font-weight: bold;
  }
  </style>