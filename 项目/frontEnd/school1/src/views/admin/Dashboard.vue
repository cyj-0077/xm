<template>
  <div class="admin-dashboard">
    <!-- 主内容区 -->
    <el-main class="dashboard-main">
      <!-- 数据概览 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-card">
              <el-icon color="#f56c6c" size="40"><User /></el-icon>
              <div class="stat-info">
                <h3>总学生数</h3>
                <p class="value">{{ studentCount }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-card">
              <el-icon color="#409eff" size="40"><User /></el-icon>
              <div class="stat-info">
                <h3>总教师数</h3>
                <p class="value">{{ teacherCount }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User } from '@element-plus/icons-vue'
import { getCounts } from '@/utils/request'
// 数据统计卡片
const studentCount = ref(null) // 示例数据
const teacherCount = ref(null) // 示例数据

// 获取学生和教师数量
const getNumber = async () => {
  const response = await getCounts()
  if(response.message == "Network Error"){
    studentCount.value = "数据库未开启"
   teacherCount.value = "数据库未开启"
  }else{
    studentCount.value = response.studentCount
    teacherCount.value = response.teacherCount
  }
}
getNumber()


</script>

<style scoped lang="scss">
.admin-dashboard {
  height: 100%;
  background: #f5f7fa;

  .dashboard-main {
    padding: 20px;

    .stats-row {
      margin-bottom: 20px;

      .stat-card {
        display: flex;
        align-items: center;
        gap: 15px;

        .value {
          font-size: 24px;
          margin: 5px 0 0;
          color: var(--el-color-danger);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .stats-row {
    .el-col { margin-bottom: 15px; }
  }
}
</style>