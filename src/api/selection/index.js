import request from '@/utils/request'
const API = {
  SELECTION_URL: "/enrollments",
}
export { API };

//选课操作（post）
export const reqSelectionCourse = (data) =>
  request.post(API.SELECTION_URL, data)

//查看选课记录（get）
export const reqGetSelectionList = (userId, page, pageSize) =>
  request.get(`${API.SELECTION_URL}?page=${page}&pageSize=${pageSize}&userId=${userId}`)

//取消选课（delete）
export const reqCancelSelection = (enrollmentId,userId) =>
  request.delete(`${API.SELECTION_URL}?enrollmentId=${enrollmentId}&userId=${userId}`)
