<template>
  <div class="view-user">
    <el-row :gutter="20">
      <!-- 学生信息 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <h3>学生信息</h3>
          <el-input v-model="studentSearch" placeholder="搜索学生" style="margin-bottom: 10px;" />
          <el-table
            :data="filteredStudents.slice((studentPage - 1) * 15, studentPage * 15)"
            style="width: 100%"
            @sort-change="handleStudentSort"
          >
            <el-table-column prop="name" label="姓名" sortable></el-table-column>
            <el-table-column label="入学时间" sortable>
              <template #default="scope">
                {{ formatDate(scope.row.studiedTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="college" label="学院" sortable></el-table-column>
            <el-table-column prop="department" label="系别" sortable></el-table-column>
          </el-table>
          <el-pagination
            v-model:current-page="studentPage"
            :page-size="15"
            :total="filteredStudents.length"
            layout="prev, pager, next"
            @current-change="handleStudentPageChange"
          />
        </el-card>
      </el-col>

      <!-- 教师信息 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <h3>教师信息</h3>
          <el-input v-model="teacherSearch" placeholder="搜索教师" style="margin-bottom: 10px;" />
          <el-table
            :data="filteredTeachers.slice((teacherPage - 1) * 15, teacherPage * 15)"
            style="width: 100%"
            @sort-change="handleTeacherSort"
          >
            <el-table-column prop="name" label="姓名" sortable></el-table-column>
            <el-table-column label="执教时间" sortable>
              <template #default="scope">
                {{ formatDate(scope.row.teachedTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="college" label="学院" sortable></el-table-column>
            <el-table-column prop="department" label="系别" sortable></el-table-column>
          </el-table>
          <el-pagination
            v-model:current-page="teacherPage"
            :page-size="15"
            :total="filteredTeachers.length"
            layout="prev, pager, next"
            @current-change="handleTeacherPageChange"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllUsers } from '@/utils/request'
import dayjs from 'dayjs'

const students = ref([])
const teachers = ref([])
const studentPage = ref(1)
const teacherPage = ref(1)
const studentSearch = ref('')
const teacherSearch = ref('')

const fetchData = async () => {
  try {
    const { students: studentData, teachers: teacherData } = await getAllUsers()
    students.value = studentData || []
    teachers.value = teacherData || []
  } catch (error) {
    console.error('获取用户信息失败:', error)
    students.value = []
    teachers.value = []
  }
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const handleStudentPageChange = (page) => {
  studentPage.value = page
}

const handleTeacherPageChange = (page) => {
  teacherPage.value = page
}

const filteredStudents = computed(() => {
  return students.value.filter(student => 
    student.name.includes(studentSearch.value) || 
    student.college.includes(studentSearch.value) ||
    student.department.includes(studentSearch.value)
  )
})

const filteredTeachers = computed(() => {
  return teachers.value.filter(teacher => 
    teacher.name.includes(teacherSearch.value) || 
    teacher.college.includes(teacherSearch.value) ||
    teacher.department.includes(teacherSearch.value)
  )
})

const handleStudentSort = ({ prop, order }) => {
  students.value.sort((a, b) => {
    if (order === 'ascending') {
      return a[prop] > b[prop] ? 1 : -1
    } else {
      return a[prop] < b[prop] ? 1 : -1
    }
  })
}

const handleTeacherSort = ({ prop, order }) => {
  teachers.value.sort((a, b) => {
    if (order === 'ascending') {
      return a[prop] > b[prop] ? 1 : -1
    } else {
      return a[prop] < b[prop] ? 1 : -1
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.view-user {
  padding: 20px;
  background: #f5f7fa;
}

h3 {
  margin-bottom: 20px;
  color: #409eff;
}
</style>