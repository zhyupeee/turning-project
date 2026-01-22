<template>
  <div class="course-container">
    <!-- 创建课程表单 -->
    <el-card class="create-card">
      <template #header>
        <div class="card-header">
          <span>创建课程</span>
        </div>
      </template>
      
      <el-form 
        ref="createFormRef"
        :model="createForm" 
        :rules="createRules"
        label-width="100px"
        style="max-width: 600px"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input 
            v-model="createForm.courseName" 
            placeholder="请输入课程名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="课程简介" prop="desc">
          <el-input 
            v-model="createForm.desc" 
            type="textarea"
            placeholder="请输入课程简介"
            maxlength="200"
            show-word-limit
            :rows="3"
          />
        </el-form-item>
        
        <el-form-item label="封面图片" prop="img">
          <el-input 
            v-model="createForm.img" 
            placeholder="请输入封面图片链接"
            type="url"
          />
          <div class="image-preview" v-if="createForm.img">
            <img :src="createForm.img" alt="封面预览" class="preview-image" />
          </div>
        </el-form-item>
        
        <el-form-item label="分类选择" prop="categoryId">
          <el-select v-model="createForm.categoryId" placeholder="请选择分类（可选）" clearable>
            <el-option 
              v-for="category in categoryList" 
              :key="category.categoryId"
              :label="category.name" 
              :value="category.categoryId"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleCreate" :loading="createLoading">
            创建课程
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 课程列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>课程列表</span>
          <div class="header-actions">
            <el-select v-model="filterCategoryId" placeholder="筛选分类" clearable @change="handleFilterChange"  style="width: 110px;">
              <el-option label="全部课程" value="" />
              <el-option 
                v-for="category in categoryList" 
                :key="category.categoryId"
                :label="category.name" 
                :value="category.categoryId"
              />
            </el-select>
            <el-tag type="info">共 {{ total }} 条</el-tag>
          </div>
        </div>
      </template>

      <!-- 表格 -->
      <el-table 
        :data="courseList" 
        v-loading="tableLoading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="courseId" label="课程ID" width="100" />
        <el-table-column prop="courseName" label="课程名称" min-width="150" />
        <el-table-column prop="desc" label="课程简介" min-width="200" show-overflow-tooltip />
        <el-table-column label="封面图片" width="120">
          <template #default="{ row }">
            <el-image 
              v-if="row.img" 
              :src="row.img" 
              :preview-src-list="[row.img]"
              fit="cover"
              style="width: 60px; height: 40px; border-radius: 4px;"
            >
              <template #error>
                <div class="image-error">图片加载失败</div>
              </template>
            </el-image>
            <span v-else class="no-image">无封面</span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryId" label="分类ID" width="100" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewDetail(row)">
              <el-icon><View /></el-icon>
              详情
            </el-button>
            <el-button type="success" link size="small" @click="handleAssociateCategory(row)">
              <el-icon><Link /></el-icon>
              关联分类
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
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

    <!-- 课程详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="课程详情" 
      width="600px"
    
    >
      <div v-if="currentCourse" class="course-detail">
        <el-descriptions  border>
          <el-descriptions-item label="课程ID">{{ currentCourse.courseId }}</el-descriptions-item>
          <el-descriptions-item label="课程名称">{{ currentCourse.courseName }}</el-descriptions-item>
          <el-descriptions-item label="课程简介" :span="2">{{ currentCourse.desc }}</el-descriptions-item>
          <el-descriptions-item label="封面图片" :span="2">
            <el-image 
              v-if="currentCourse.img" 
              :src="currentCourse.img" 
              :preview-src-list="[currentCourse.img]"
              style="max-width: 200px; max-height: 150px;"
            />
            <span v-else>无封面图片</span>
          </el-descriptions-item>
          <el-descriptions-item label="分类ID">{{ currentCourse.categoryId || '未分类' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 关联分类对话框 -->
    <el-dialog 
      v-model="associateDialogVisible" 
      title="关联课程到分类" 
      width="500px"
    >
      <el-form :model="associateForm" label-width="80px">
        <el-form-item label="课程ID">
          <el-input v-model="associateForm.courseId" disabled />
        </el-form-item>
        <el-form-item label="选择分类" prop="categoryId">
          <el-select v-model="associateForm.categoryId" placeholder="请选择分类">
            <el-option 
              v-for="category in categoryList" 
              :key="category.categoryId"
              :label="category.name" 
              :value="category.categoryId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="associateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAssociateConfirm" :loading="associateLoading">
          确认关联
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { View, Link, Delete } from '@element-plus/icons-vue'
import { 
  reqGetCategoryList, 
  reqCreateCourse, 
  reqGetCourseList, 
  reqGetCourseDetail, 
  reqPostCategoryCourse 
} from '@/api/course'

// 创建课程表单
const createFormRef = ref()
const createForm = reactive({
  courseName: '',
  desc: '',
  img: '',
  categoryId: ''
})

// 表单验证规则
const createRules = {
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  desc: [
    { required: true, message: '请输入课程简介', trigger: 'blur' },
    { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
  ],
  img: [
    { required: true, message: '请输入封面图片链接', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ]
}

// 列表数据
const courseList = ref([])
const categoryList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const filterCategoryId = ref('')
const tableLoading = ref(false)
const createLoading = ref(false)

// 对话框相关
const detailDialogVisible = ref(false)
const associateDialogVisible = ref(false)
const currentCourse = ref(null)
const associateForm = reactive({
  courseId: '',
  categoryId: ''
})
const associateLoading = ref(false)

// 获取分类列表
const getCategoryList = async () => {
  try {
    const result = await reqGetCategoryList(1, 100) // 获取前100个分类
    if (result.code > 0) {
      categoryList.value = result.data.categoryList || result.data || []
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

// 获取课程列表
const getCourseList = async () => {
  tableLoading.value = true
  try {
    const result = await reqGetCourseList(currentPage.value, pageSize.value, filterCategoryId.value)
    if (result.code > 0) {
      courseList.value = result.data.courseList || []
      total.value = result.data.total || 0
      // currentPage.value = result.data.page || 1
      // pageSize.value = result.data.pageSize || 10
    } else {
      ElMessage.error(result.message || '获取课程列表失败')
    }
  } catch (error) {
    console.error('获取课程列表错误:', error)
    ElMessage.error('获取课程列表失败')
  } finally {
    tableLoading.value = false
  }
}

// 创建课程
const handleCreate = async () => {
  if (!createFormRef.value) return

  await createFormRef.value.validate(async (valid) => {
    if (valid) {
      createLoading.value = true
      try {
        const result = await reqCreateCourse(createForm)
        if (result.code > 0) {
          ElMessage.success(`创建成功！课程ID：${result.data.courseId}，课程名称：${result.data.courseName}`)
          resetForm()
          getCourseList() // 刷新列表
        } else {
          ElMessage.error(result.message || '创建课程失败')
        }
      } catch (error) {
        console.error('创建课程错误:', error)
        ElMessage.error('创建课程失败')
      } finally {
        createLoading.value = false
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  if (createFormRef.value) {
    createFormRef.value.resetFields()
  }
}

// 查看课程详情
const handleViewDetail = async (row) => {
  try {
    const result = await reqGetCourseDetail(row.courseId)
    if (result.code > 0) {
      currentCourse.value = result.data
      detailDialogVisible.value = true
    } else {
      ElMessage.error(result.message || '获取课程详情失败')
    }
  } catch (error) {
    console.error('获取课程详情错误:', error)
    ElMessage.error('获取课程详情失败')
  }
}

// 关联课程到分类
const handleAssociateCategory = (row) => {
  associateForm.courseId = row.courseId
  associateForm.categoryId = ''
  associateDialogVisible.value = true
}

// 确认关联
const handleAssociateConfirm = async () => {
  if (!associateForm.categoryId) {
    ElMessage.warning('请选择分类')
    return
  }

  associateLoading.value = true
  try {
    const result = await reqPostCategoryCourse(associateForm.categoryId, {
      courseId: associateForm.courseId
    })
    if (result.code > 0) {
      ElMessage.success(`关联成功！分类ID：${result.data.categoryId}，课程ID：${result.data.courseId}`)
      associateDialogVisible.value = false
      getCourseList() // 刷新列表
    } else {
      ElMessage.error(result.message || '关联失败')
    }
  } catch (error) {
    console.error('关联课程错误:', error)
    ElMessage.error('关联失败')
  } finally {
    associateLoading.value = false
  }
}

// 删除课程
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除课程 "${row.courseName}" 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      ElMessage.info('删除功能开发中...')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 筛选分类变化
const handleFilterChange = () => {
  currentPage.value = 1
  getCourseList()
}

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  getCourseList()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  getCourseList()
}


// 初始化
onMounted(() => {
  getCategoryList()
  getCourseList()
})
</script>

<style scoped lang="scss">
.course-container {
  padding: 20px;
  
  .create-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }
    
    .image-preview {
      margin-top: 8px;
      
      .preview-image {
        max-width: 200px;
        max-height: 150px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
      }
    }
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
    
    .no-image {
      color: #909399;
      font-size: 12px;
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
  }
  
  .course-detail {
    .el-descriptions {
      margin-top: 10px;
    }
  }
}

// 操作按钮样式优化
:deep(.el-table__cell) {
  .el-button + .el-button {
    margin-left: 8px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .course-container {
    padding: 10px;
    
    .create-card,
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
  }
}
</style>
    

