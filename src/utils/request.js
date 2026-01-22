//进行axios二次封装：使用请求与响应拦截器
import axios from "axios";
import { ElMessage } from "element-plus"
//引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
})
//request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  let userStore = useUserStore()
  //添加token
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  return config
});

request.interceptors.response.use((response) => {
  //简化数据
  return response.data;
}, (error) => {
  let message = ''
  let status = error.response.status;
  switch (status) {
    case 401:
      message = "TOKEN过期"
      break;
    case 403:
      message = "无权访问"
      break;
    case 404:
      message = "请求地址错误"
      break;
    case 500:
      message = "服务器出现问题"
      break;
    default:
      message = "网络出现问题"
      break;
  }
  //提示错误信息
  ElMessage({
    type: 'error',
    message
  });
  return Promise.reject(error);
})
export default request;