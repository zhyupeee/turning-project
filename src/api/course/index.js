import request from '@/utils/request'
const API = {
  CATEGORY_URL: "/categories",
  COURSE_URL: "/courses",
  CATEGORY_COURSES_URL: "/categories",
  COURSE_DETAIL_URL: "/courses",
}
export { API };

// GET请求：获取课程分类列表
export const reqGetCategoryList = (page, pageSize) =>
  request.get(`${API.CATEGORY_URL}?page=${page}&pageSize=${pageSize}`)

// POST请求：创建课程分类
export const reqCreateCategory = (data) =>
  request.post(API.CATEGORY_URL, data)

//以下是课程数据管理

// POST请求：创建课程
export const reqCreateCourse = (data) =>
  request.post(API.COURSE_URL, data)
// GET请求：获取课程列表
export const reqGetCourseList = (page, pageSize,categoryId) =>
  request.get(`${API.COURSE_URL}?page=${page}&pageSize=${pageSize}&categoryId=${categoryId}`)


// GET请求：获取课程详情
export const reqGetCourseDetail = (courseId) =>
  request.get(`${API.COURSE_DETAIL_URL}/${courseId}`)
// POST请求：关联课程到分类
export const reqPostCategoryCourse = (categoryId) =>
  request.post(`${API.CATEGORY_COURSES_URL}/${categoryId}/courses`)
