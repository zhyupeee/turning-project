import request from '@/utils/request'
const API = {
  EVALUATION_URL: "/reviews",
}
export { API };

//获取课程评价（get）
export const reqGetEvaluationList = (courseId) =>
  request.get(`${API.EVALUATION_URL}?courseId=${courseId}`)
//发表课程评价（post）
export const reqPostEvaluation = (data) =>
  request.post(API.EVALUATION_URL, data)
