<template>
  <div class="selection-container">
    <!-- 选课表单 -->
    <el-card class="selection-card" title="选课操作">
      <el-form 
        ref="selectionFormRef" 
        :model="selectionForm" 
        :rules="selectionRules" 
        label-width="100px"
        style="max-width: 500px"
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input 
            v-model="selectionForm.userId" 
            placeholder="请输入用户ID"
            type="number"
            min="1"
          />
        </el-form-item>
        
        <el-form-item label="课程ID" prop="courseId">
          <el-input 
            v-model="selectionForm.courseId" 
            placeholder="请输入课程ID"
            type="number"
            min="1"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSelection" :loading="selectionLoading">
            选课
          </el-button>
          <el-button @click="resetSelectionForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 查看选课记录 -->
    <el-card class="record-card" title="查看选课记录">
      <template #header>
        <div class="card-header">
          <span>选课记录</span>
          <div class="header-actions">
            <el-input 
              v-model="searchUserId" 
              placeholder="输入用户ID查询" 
              style="width: 200px; margin-right: 12px;"
              type="number"
              min="1"
            />
            <el-button type="primary" @click="handleSearch" :loading="searchLoading">
              查询
            </el-button>
            <el-tag type="info">共 {{ total }} 条</el-tag>
          </div>
        </div>
      </template>

      <!-- 选课记录表格 -->
      <el-table 
        :data="enrollmentList" 
        v-loading="tableLoading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="enrollmentId" label="选课记录ID" width="120" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="courseId" label="课程ID" width="100" />
        <el-table-column prop="enrollTime" label="选课时间" width="180" />
        <el-table-column label="课程信息" min-width="200">
          <template #default="{ row }">
            <div v-if="row.course" class="course-info">
              <el-image 
                v-if="row.course.img" 
                :src="row.course.img" 
                :preview-src-list="[row.course.img]"
                fit="cover"
                style="width: 60px; height: 40px; border-radius: 4px; margin-right: 8px;"
              >
                <template #error>
                  <div class="image-error">图片加载失败</div>
                </template>
              </el-image>
              <div>
                <div class="course-name">{{ row.course.courseName }}</div>
                <div class="course-id">ID: {{ row.course.courseId }}</div>
              </div>
            </div>
            <span v-else class="no-course">课程信息缺失</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link size="small" @click="handleCancelSelection(row)">
              取消选课
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          :total="total"
          layout=" prev, pager, next, jumper,->,sizes,total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  reqSelectionCourse, 
  reqGetSelectionList, 
  reqCancelSelection 
} from '@/api/selection'

// 选课表单
const selectionFormRef = ref()
const selectionForm = reactive({
  userId: '',
  courseId: ''
})

// 表单验证规则
const selectionRules = {
  userId: [
    { required: true, message: '请输入用户ID', trigger: 'blur' },
    { type: 'number', message: '用户ID必须为数字', trigger: 'blur', transform: (value) => Number(value) }
  ],
  courseId: [
    { required: true, message: '请输入课程ID', trigger: 'blur' },
    { type: 'number', message: '课程ID必须为数字', trigger: 'blur', transform: (value) => Number(value) }
  ]
}

// 列表数据
const enrollmentList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchUserId = ref('')

// 加载状态
const selectionLoading = ref(false)
const tableLoading = ref(false)
const searchLoading = ref(false)

// 选课操作
const handleSelection = async () => {
  if (!selectionFormRef.value) return

  await selectionFormRef.value.validate(async (valid) => {
    if (valid) {
      selectionLoading.value = true
      try {
        const data = {
          userId: Number(selectionForm.userId),
          courseId: Number(selectionForm.courseId)
        }
        
        const result = await reqSelectionCourse(data)
        if (result.code > 0) {
          ElMessage.success(`选课成功！选课记录ID：${result.data.enrollmentId}`)
          resetSelectionForm()
          // 如果当前正在查看该用户的选课记录，刷新列表
          if (searchUserId.value && searchUserId.value === selectionForm.userId) {
            getSelectionList()
          }
        } else {
          ElMessage.error(result.message || '选课失败')
        }
      } catch (error) {
        console.error('选课错误:', error)
        ElMessage.error('选课失败')
      } finally {
        selectionLoading.value = false
      }
    }
  })
}

// 重置选课表单
const resetSelectionForm = () => {
  if (selectionFormRef.value) {
    selectionFormRef.value.resetFields()
  }
  selectionForm.userId = ''
  selectionForm.courseId = ''
}

// 查询选课记录
const handleSearch = () => {
  if (!searchUserId.value) {
    ElMessage.warning('请输入用户ID')
    return
  }
  currentPage.value = 1
  getSelectionList()
}

// 获取选课记录列表
const getSelectionList = async () => {
  if (!searchUserId.value) {
    enrollmentList.value = []
    total.value = 0
    return
  }

  tableLoading.value = true
  try {
    const result = await reqGetSelectionList(
      Number(searchUserId.value), 
      currentPage.value, 
      pageSize.value
    )
    
    if (result.code > 0) {
      enrollmentList.value = result.data.enrollmentList || []
      total.value = result.data.total || 0
    } else {
      ElMessage.error(result.message || '获取选课记录失败')
      enrollmentList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取选课记录错误:', error)
    ElMessage.error('获取选课记录失败')
    enrollmentList.value = []
    total.value = 0
  } finally {
    tableLoading.value = false
  }
}

// 取消选课
const handleCancelSelection = (row) => {
  ElMessageBox.confirm(
    `确定要取消选课记录 "${row.enrollmentId}" 吗？`,
    '取消选课确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        const result = await reqCancelSelection(row.enrollmentId, row.userId)
        if (result.code > 0) {
          ElMessage.success(result.message || '取消选课成功')
          getSelectionList() // 刷新列表
        } else {
          ElMessage.error(result.message || '取消选课失败')
        }
      } catch (error) {
        console.error('取消选课错误:', error)
        ElMessage.error('取消选课失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}

// 分页大小改变
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  getSelectionList()
}

// 当前页改变
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  getSelectionList()
}

// 初始化
onMounted(() => {
  // 页面加载时不自动查询，需要用户输入用户ID后查询
})
</script>

<style scoped lang="scss">
.selection-container {
  padding: 20px;

  .selection-card {
    margin-bottom: 20px;
  }

  .record-card {
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

    .course-info {
      display: flex;
      align-items: center;

      .course-name {
        font-weight: 500;
        margin-bottom: 4px;
      }

      .course-id {
        font-size: 12px;
        color: #909399;
      }
    }

    .no-course {
      color: #909399;
      font-size: 12px;
    }

    .image-error {
      width: 60px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
      border-radius: 4px;
      font-size: 12px;
      color: #909399;
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .selection-container {
    padding: 10px;

    .selection-card,
    .record-card {
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
  }
}
</style>
