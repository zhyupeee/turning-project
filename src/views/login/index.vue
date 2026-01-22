<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到教学管理信息服务平台</h2>
          <el-form-item prop="userName">
            <el-input :prefix-icon="User" v-model="loginForm.userName"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loginLoading" class="login_btn" type="primary" size="default"
              @click="login">登录</el-button>
            <el-button :loading="registerLoading" class="register_btn" type="primary" size="default"
              @click="register">注册</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus';
//引入时间函数
import { getTime } from '@/utils/time';
//获取el-form组件
let loginForms = ref()
//引入路由
let $router = useRouter()
let $route = useRoute()

//引入用户小仓库
import useUserStore from '@/store/modules/user'
let useStore = useUserStore()
//收集账号和密码数据
let loginForm = reactive({
  userName: 'admin',
  password: '111111'
})
// 登录和注册按钮的独立loading状态
let loginLoading = ref(false)
let registerLoading = ref(false)
// 注册
const register = async () => {
  try {
    // 表单校验
    await loginForms.value.validate()

    // 注册按钮loading状态
    registerLoading.value = true

    // 调用用户store的注册方法
    const result = await useStore.userRegister(loginForm)

    // 注册成功提示
    ElNotification({
      type: 'success',
      message: '注册成功，请登录',
      title: '注册成功'
    })

    // 清空表单
    loginForm.userName = ''
    loginForm.password = ''
  } catch (error) {
    // 注册按钮loading状态
    registerLoading.value = false
    // 注册失败提示
    ElNotification({
      type: 'error',
      message: '注册失败',
      title: '注册失败'
    })
    console.error('注册失败:', error)
  } finally {
    // 确保无论成功或失败都取消loading状态
    registerLoading.value = false
  }
}
//登录
const login = async () => {
  //表单校验
  await loginForms.value.validate()
  //登录按钮loading状态
  loginLoading.value = true
  try {
    await useStore.userLogin(loginForm)
    // 关键修改：登录成功后立即获取用户信息
    await useStore.userInfo()
    //登录成功跳转首页
    let redirect: any = $route.query.redirect
    $router.push(redirect || '/')
    //登录成功提示
    ElNotification({
      type: 'success',
      message: '登录成功',
      title: `Hi,` + getTime() + '好'
    })
    //登录成功loading状态
    loginLoading.value = false
  } catch (error) {
    //登录按钮loading状态
    loginLoading.value = false
    //登录失败提示
    ElNotification({
      type: 'error',
      message: '登录失败',
    })
  }
}
//表单校验规则
let rules = {
  userName: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 5, max: 12, message: '账号长度为6-12位', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 12, message: '密码长度为5-12位', trigger: 'change' }
  ]
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg')no-repeat;
  background-size: cover;
}

.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url('@/assets/images/login_form.png')no-repeat;
  background-size: cover;
  padding: 40px;
}

h1 {
  color: white;
  font-size: 40px;
}

h2 {
  color: white;
  font-size: 20px;
  margin: 20px 0px;
}

.login_btn {
  width: 100%;
  background-color: #409eff;
}

.register_btn {
  width: 110%;
  background-color: #409eff;
  margin-top: 15px;
  margin-left: 0px;
}
</style>
