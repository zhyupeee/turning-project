<template>
  <div class="evaluation-container">
    <!-- 发表评价表单 -->
    <el-card class="post-card" title="发表课程评价">
      <el-form 
        ref="evaluationFormRef" 
        :model="evaluationForm" 
        :rules="evaluationRules" 
        label-width="100px"
        style="max-width: 600px"
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input 
            v-model="evaluationForm.userId" 
            placeholder="请输入用户ID"
            type="number"
            min="1"
          />
        </el-form-item>
        
        <el-form-item label="课程ID" prop="courseId">
          <el-input 
            v-model="evaluationForm.courseId" 
            placeholder="请输入课程ID"
            type="number"
            min="1"
          />
        </el-form-item>
        
        <el-form-item label="评价内容" prop="content">
          <el-input 
            v-model="evaluationForm.content" 
            type="textarea"
            placeholder="请输入您的评价内容"
            maxlength="500"
            show-word-limit
            :rows="4"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handlePostEvaluation" :loading="postLoading">
            发表评价
          </el-button>
          <el-button @click="resetEvaluationForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 查看课程评价 -->
    <el-card class="list-card" title="课程评价列表">
      <template #header>
        <div class="card-header">
          <span>评价列表</span>
          <div class="header-actions">
            <el-input 
              v-model="searchCourseId" 
              placeholder="输入课程ID查询" 
              style="width: 200px; margin-right: 12px;"
              type="number"
              min="1"
            />
            <el-button type="primary" @click="handleSearch" :loading="searchLoading">
              查询评价
            </el-button>
            <el-tag type="info">共 {{ evaluationList.length }} 条</el-tag>
          </div>
        </div>
      </template>

      <!-- 评价列表 -->
      <div v-if="evaluationList.length > 0" class="evaluation-list">
        <div 
          v-for="evaluation in evaluationList" 
          :key="evaluation.reviewId" 
          class="evaluation-item"
        >
          <div class="evaluation-header">
            <div class="user-info">
              <el-avatar :size="40" style="background-color: #409EFF; margin-right: 12px;">
                {{ evaluation.userName ? evaluation.userName.charAt(0) : 'U' }}
              </el-avatar>
              <div>
                <div class="user-name">{{ evaluation.userName || '匿名用户' }}</div>
                <div class="evaluation-time">{{ formatTime(evaluation.createTime) }}</div>
              </div>
            </div>
            <div class="evaluation-meta">
              <el-tag size="small">评价ID: {{ evaluation.reviewId }}</el-tag>
              <el-tag size="small" type="info">用户ID: {{ evaluation.userId }}</el-tag>
              <el-tag size="small" type="success">课程ID: {{ evaluation.courseId }}</el-tag>
            </div>
          </div>
          
          <div class="evaluation-content">
            {{ evaluation.content }}
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-empty description="暂无评价数据" v-if="!searchCourseId" />
        <el-empty description="请输入课程ID查询评价" v-else-if="!hasSearched" />
        <el-empty description="该课程暂无评价" v-else />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  reqGetEvaluationList, 
  reqPostEvaluation 
} from '@/api/evaluation'

// 发表评价表单
const evaluationFormRef = ref()
const evaluationForm = reactive({
  userId: '',
  courseId: '',
  content: ''
})

// 表单验证规则
const evaluationRules = {
  userId: [
    { required: true, message: '请输入用户ID', trigger: 'blur' },
    { type: 'number', message: '用户ID必须为数字', trigger: 'blur', transform: (value) => Number(value) }
  ],
  courseId: [
    { required: true, message: '请输入课程ID', trigger: 'blur' },
    { type: 'number', message: '课程ID必须为数字', trigger: 'blur', transform: (value) => Number(value) }
  ],
  content: [
    { required: true, message: '请输入评价内容', trigger: 'blur' },
    { min: 5, max: 500, message: '评价内容长度在 5 到 500 个字符', trigger: 'blur' }
  ]
}

// 评价列表数据
const evaluationList = ref([])
const searchCourseId = ref('')
const hasSearched = ref(false)

// 加载状态
const postLoading = ref(false)
const searchLoading = ref(false)

// 格式化时间显示
const formatTime = (timeString) => {
  if (!timeString) return '未知时间'
  
  try {
    const date = new Date(timeString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return timeString
  }
}

// 发表评价
const handlePostEvaluation = async () => {
  if (!evaluationFormRef.value) return

  await evaluationFormRef.value.validate(async (valid) => {
    if (valid) {
      postLoading.value = true
      try {
        const data = {
          content: evaluationForm.content,
          userId: Number(evaluationForm.userId),
          courseId: Number(evaluationForm.courseId)
        }
        
        const result = await reqPostEvaluation(data)
        if (result.code > 0) {
          ElMessage.success(`评价发表成功！评价ID：${result.data.reviewId}`)
          resetEvaluationForm()
          
          // 如果当前正在查看该课程的评价，刷新列表
          if (searchCourseId.value && searchCourseId.value === evaluationForm.courseId) {
            getEvaluationList()
          }
        } else {
          ElMessage.error(result.message || '发表评价失败')
        }
      } catch (error) {
        console.error('发表评价错误:', error)
        ElMessage.error('发表评价失败')
      } finally {
        postLoading.value = false
      }
    }
  })
}

// 重置评价表单
const resetEvaluationForm = () => {
  if (evaluationFormRef.value) {
    evaluationFormRef.value.resetFields()
  }
  evaluationForm.userId = ''
  evaluationForm.courseId = ''
  evaluationForm.content = ''
}

// 查询评价
const handleSearch = () => {
  if (!searchCourseId.value) {
    ElMessage.warning('请输入课程ID')
    return
  }
  hasSearched.value = true
  getEvaluationList()
}

// 获取评价列表
const getEvaluationList = async () => {
  if (!searchCourseId.value) {
    evaluationList.value = []
    return
  }

  searchLoading.value = true
  try {
    const result = await reqGetEvaluationList(Number(searchCourseId.value))
    
    if (result.code > 0) {
      evaluationList.value = result.data || []
      ElMessage.success(`获取到 ${evaluationList.value.length} 条评价`)
    } else {
      ElMessage.error(result.message || '获取评价列表失败')
      evaluationList.value = []
    }
  } catch (error) {
    console.error('获取评价列表错误:', error)
    ElMessage.error('获取评价列表失败')
    evaluationList.value = []
  } finally {
    searchLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.evaluation-container {
  padding: 20px;

  .post-card {
    margin-bottom: 20px;
  }

  .list-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;

      .header-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    }

    .evaluation-list {
      .evaluation-item {
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        background: #fff;
        transition: box-shadow 0.3s;

        &:hover {
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }

        .evaluation-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;

          .user-info {
            display: flex;
            align-items: center;

            .user-name {
              font-weight: 500;
              margin-bottom: 4px;
            }

            .evaluation-time {
              font-size: 12px;
              color: #909399;
            }
          }

          .evaluation-meta {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            justify-content: flex-end;
          }
        }

        .evaluation-content {
          line-height: 1.6;
          color: #606266;
          font-size: 14px;
          white-space: pre-wrap;
          word-break: break-word;
        }
      }
    }

    .empty-state {
      padding: 40px 0;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .evaluation-container {
    padding: 10px;

    .post-card,
    .list-card {
      margin-bottom: 10px;
    }

    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;

      .header-actions {
        width: 100%;
        justify-content: space-between;
      }
    }

    .evaluation-item {
      .evaluation-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;

        .evaluation-meta {
          justify-content: flex-start;
        }
      }
    }
  }
}
</style>
