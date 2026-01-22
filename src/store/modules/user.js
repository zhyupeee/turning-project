// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqRegister } from '@/api/user'
// 引入操作本地存储的工具文件
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { ElMessage } from 'element-plus'


// 创建用户
const useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: () => {
    return {
      token: GET_TOKEN(), // 用户唯一标识token
      // menuRoutes: constantRoute, // 仓库存储生成菜单需要的数组（路由）
      userName: '',
      userId: '',
      account: '',
      password: '',
    }
  },
  // 异步｜逻辑的地方
  actions: {
    // 用户注册方法
    async userRegister(data) {
      const result = await reqRegister(data)

      console.log('注册返回结果:', result)
      this.account = data.userName
      this.password = data.password
      this.userId = Date.now().toString()
      this.userName = data.userName

      return result
    },

    // 用户登录方法
    async userLogin(data) {
      // 登录请求
      const result = await reqLogin(data)
      // 登录请求：成功200->token
      if (result.code > 0) {
        // pinia 仓库存储一下token
        this.token = result.data.token
        this.userId = result.data.userId
        this.account = result.data.account
        SET_TOKEN(result.data.token)
        ElMessage({
          message: '登录成功',
          type: 'success',
          duration: 3000
        })
        return {
          userId: result.data.userId,
          account: result.data.account,
          token: result.data.token
        }
      } else {
        ElMessage({
          message: '登录失败',
          type: 'error',
          duration: 3000
        })
        return Promise.reject(new Error(result.message || result.data))
      }
    },
    // 获取用户信息方法
    async userInfo() {
      // 获取用户信息存储仓库当中【用户头像，名字】
      const result = await reqUserInfo()
      // 如果获取用户信息成功，存储一下用户信息
      if (result.code > 0) {
        this.userName = result.data.userName
        this.userId = result.data.userId
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogout() {
      const result = await reqLogout()
      if (result.code == 200) {
        // 目前咩有 mock接口：退出登录接口（通知服务器本地用户唯一标识失效）
        this.token = ''
        this.userName = ''
        this.userId = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

// 对外暴露小仓库
export default useUserStore