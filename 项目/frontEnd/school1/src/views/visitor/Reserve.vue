<template>
  <div class="visitor-container">
    <!-- 预定表部分 -->
    <el-card class="booking-card">
      <template #header>
        <div class="card-header">
          <span>预定信息</span>
        </div>
      </template>
      <el-form :model="bookingForm" label-width="100px">
        <el-form-item label="预定日期">
          <el-date-picker
            v-model="bookingForm.date"
            type="date"
            placeholder="选择预定日期"
            :disabled-date="disabledDate"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleBooking" :loading="booking">
            提交预定
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { reserveVisitor } from '@/utils/request'
import { useVisitorStore } from '@/router/store'
import dayjs from 'dayjs'

const visitorStore = useVisitorStore()
const visitorIdentity = computed(() => visitorStore.visitorInfo.identity)

const bookingForm = ref({
  date: '',
  identity: visitorIdentity.value
})
const booking = ref(false)

// 禁用过去的日期
function disabledDate(time) {
  return time.getTime() < Date.now() - 8.64e7
}

// 处理预定
async function handleBooking() {
  if (!bookingForm.value.date) {
    ElMessage.warning('请选择预定时间')
    return
  }

  booking.value = true
  try {
    const data={
      ReservationTime:String(bookingForm.value.date),
      Identity:visitorIdentity.value
    }
    console.log(data)
    const res = await reserveVisitor(data)
    if(res.code==200){
      ElMessage.success('预定成功')
      bookingForm.value.date = ''
    }else{
      ElMessage.error('预定失败')
    }
  } catch (error) {
    console.error('预定失败:', error)
    ElMessage.error(error.message || '预定失败，请重试')
  } finally {
    booking.value = false
  }
}
</script>

<style scoped>
.visitor-container {
  padding: 20px;
}

.booking-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-form {
  max-width: 500px;
}
</style>