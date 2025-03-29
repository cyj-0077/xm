<template>
    <div class="profile-container">
        <el-container>
            <el-main class="main">
                <el-row :gutter="20">
                    <!-- 左边信息展示 -->
                    <el-col :span="16">
                        <el-row :gutter="20" justify="center">
                            <el-col :span="24">
                                <el-card class="info-card" shadow="hover">
                                    <div class="info-item">
                                        <el-icon>
                                            <User />
                                        </el-icon>
                                        <span class="label">姓名：</span>
                                        <span class="value">{{ userInfo.name }}</span>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="24">
                                <el-card class="info-card" shadow="hover">
                                    <div class="info-item">
                                        <el-icon>
                                            <Medal />
                                        </el-icon>
                                        <span class="label">身份：</span>
                                        <span class="value">{{ userInfo.role }}</span>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="24">
                                <el-card class="info-card" shadow="hover">
                                    <div class="info-item">
                                        <el-icon>
                                            <School />
                                        </el-icon>
                                        <span class="label">学院：</span>
                                        <span class="value">{{ userInfo.college }}</span>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="24">
                                <el-card class="info-card" shadow="hover">
                                    <div class="info-item">
                                        <el-icon>
                                            <OfficeBuilding />
                                        </el-icon>
                                        <span class="label">系别：</span>
                                        <span class="value">{{ userInfo.department }}</span>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="24">
                                <el-card class="info-card" shadow="hover">
                                    <div class="info-item">
                                        <el-icon>
                                            <Calendar />
                                        </el-icon>
                                        <span class="label">时间：</span>
                                        <span class="value">{{ userInfo.time }}</span>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/router/store'
import { User, Medal, School, OfficeBuilding, Calendar } from '@element-plus/icons-vue'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
</script>

<style scoped lang="scss">
.profile-container {
    min-height: 100%;
    background-color: #f0f2f5;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;

    .main {
        padding: 10px;
        width: 100%;
        max-width: 1200px;

        .info-card {
            transition: all 0.3s;
            margin-bottom: 10px;
            padding: 32px;
            font-size: 16px;

            .info-item {
                display: flex;
                align-items: center;
                padding: 10px;

                .el-icon {
                    font-size: 18px;
                    color: #909399;
                    margin-right: 10px;
                }

                .label {
                    color: #606266;
                    margin-right: 10px;
                    font-weight: 500;
                }

                .value {
                    color: #333;
                    flex: 1;
                }
            }
        }

        .placeholder {
            background-color: #e0f7fa;
            border: 1px solid #00acc1;
        }
    }
}
</style>