
import request from '@/utils/request'

const API = {
  LOGIN_URL: "/auth/login",
  REGISTER_URL: "/auth/register",
  USERINFO_URL: "/user/"
};
export { API };
//登录接口
export const reqLogin = (data) => request.post(API.LOGIN_URL, data)
//注册接口
export const reqRegister = (data) => request.post(API.REGISTER_URL, data)
//获取用户信息接口
export const reqUserInfo = () => request.get(API.USERINFO_URL)