<template>
  <div class="category-container">
    <!-- 创建分类表单 -->
    <el-card class="create-card">
      <template #header>
        <div class="card-header">
          <span>创建课程分类</span>
        </div>
      </template>

      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="100px"
        style="max-width: 500px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="createForm.name" placeholder="请输入分类名称" maxlength="20" show-word-limit />
        </el-form-item>

        <el-form-item label="分类描述" prop="desc">
          <el-input v-model="createForm.desc" type="textarea" placeholder="请输入分类描述" maxlength="100" show-word-limit
            :rows="3" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleCreate" :loading="createLoading">
            创建分类
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 分类列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>课程分类列表</span>
          <el-tag type="info">共 {{ total }} 条</el-tag>
        </div>
      </template>

      <!-- 表格 -->
      <el-table :data="categoryList" v-loading="tableLoading" stripe style="width: 100%">
        <el-table-column prop="categoryId" label="分类ID" width="100" />
        <el-table-column prop="name" label="分类名称" min-width="150" />
        <el-table-column prop="desc" label="分类描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
          :total="total"  layout=" prev, pager, next, jumper,->,sizes,total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reqGetCategoryList, reqCreateCategory } from '@/api/course'

// 创建表单
const createFormRef = ref()
const createForm = reactive({
  name: '',
  desc: ''
})

// 表单验证规则
const createRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  desc: [
    { required: true, message: '请输入分类描述', trigger: 'blur' },
    { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
  ]
}

// 列表数据
const categoryList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(5)
const tableLoading = ref(false)
const createLoading = ref(false)

// 获取分类列表
const getCategoryList = async () => {
  tableLoading.value = true
  try {
    const result = await reqGetCategoryList(currentPage.value, pageSize.value)
    if (result.code > 0) {
      categoryList.value = result.data.categoryList || []
      total.value = result.data.total || 0
    } else {
      ElMessage.error(result.message || '获取分类列表失败')
    }
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  } finally {
    tableLoading.value = false
  }
}

// 创建分类
const handleCreate = async () => {
  if (!createFormRef.value) return

  await createFormRef.value.validate(async (valid) => {
    if (valid) {
      createLoading.value = true
      try {
        const result = await reqCreateCategory(createForm)
        if (result.code > 0) {
          ElMessage.success(`创建成功！分类ID：${result.data.categoryId}，分类名称：${result.data.name}`)
          resetForm()
          getCategoryList() // 刷新列表
        } else {
          ElMessage.error(result.message || '创建分类失败')
        }
      } catch (error) {
        ElMessage.error('创建分类失败')
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
  createForm.name = ''
  createForm.desc = ''
}

// 删除分类
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除分类 "${row.name}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      ElMessage.info('删除功能开发中...')
      // 这里可以添加实际的删除逻辑
    })
    .catch(() => {
      // 取消删除
    })
}

// 分页大小改变
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  getCategoryList()
}

// 当前页改变
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  getCategoryList()
}

onMounted(() => {
  getCategoryList()
})
</script>

<style scoped lang="scss">
.category-container {
  padding: 20px;

  .create-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }
  }

  .list-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
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
  .category-container {
    padding: 10px;

    .create-card,
    .list-card {
      margin-bottom: 10px;
    }
  }
}
</style>