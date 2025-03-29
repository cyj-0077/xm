<template>
  <div class="add-user">
    <el-form :model="form" label-width="120px">
      <el-form-item label="用户类型">
        <el-radio-group v-model="form.userType">
          <el-radio :value="'teacher'">教师</el-radio>
          <el-radio :value="'student'">学生</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="工号">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="身份证明">
        <el-input v-model="form.identify" />
      </el-form-item>
      <el-form-item v-if="form.userType === 'teacher'" label="执教时间">
        <el-date-picker
          v-model="form.time"
          type="date"
          placeholder="选择执教时间"
          format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item v-if="form.userType === 'student'" label="入学时间">
        <el-date-picker
          v-model="form.time"
          type="date"
          placeholder="选择入学时间"
          format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="学院">
        <el-input v-model="form.college" />
      </el-form-item>
      <el-form-item label="系别">
        <el-input v-model="form.department" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs' // 使用 dayjs 库来格式化日期
import {idToRole,setOutId,setUserId} from '../../../../../blockChain/utils/userContract.js'
import {registerUser} from '@/utils/request'
const form = ref({
  userType: 'teacher',
  id: '',
  name: '',
  identify: '',
  time: '',
  college: '',
  department: ''
})

async function submitForm() {
  // 检查必填字段是否为空
  if (!form.value.name || !form.value.identify || !form.value.college || !form.value.department ||
      (form.value.userType === 'teacher' && !form.value.time) ||
      (form.value.userType === 'student' && !form.value.time)) {
    ElMessage.error('请填写所有必填字段')
    return
  }
  const result = await idToRole(form.value.id, form.value.userType,form.value.identify)
  if(result.success){
    // 准备要发送的数据
  const dataToSend = {
    name: form.value.name,
    identify: form.value.identify,
    college: form.value.college,
    department: form.value.department,
    userType: form.value.userType
  }

  // 根据用户类型添加相应的时间字段
  if (form.value.userType === 'teacher') {
    dataToSend.time = dayjs(form.value.time).format('YYYY-MM-DD')
  } else if (form.value.userType === 'student') {
    dataToSend.time = dayjs(form.value.time).format('YYYY-MM-DD')
  }

  // 提交表单逻辑
  const res = await registerUser(dataToSend)
  await setOutId(String(res.id),form.value.id)
  await setUserId(form.value.id,String(res.id))
  ElMessage.success('用户添加成功')
}else{
  if(result.reason == "1"){
    ElMessage.error('用户已存在')
  }else if(result.reason == "4"){
    ElMessage.error('角色错误')
  }
}
}

function resetForm() {
  form.value = {
    userType: 'teacher',
    id: '',
    name: '',
    identify: '',
    time: '',
    college: '',
    department: ''
  }
}
</script>

<style scoped>
.add-user {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
