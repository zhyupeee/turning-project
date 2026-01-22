export const constantRoutes = [
  {
    //登录
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录',
      hidden: true,
    }
  },
  {
    //登录成功以后展示
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: '',
    meta: {
      title: '',
      hidden: false,
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled'
        }
      },
      {
        // 课程分类管理
        path: '/category',
        component: () => import('@/views/course/category/index.vue'),
        name: 'category',
        meta: {
          title: '课程分类管理',
          hidden: false,
          icon: 'Folder'
        }
      },
      {
        // 课程数据管理
        path: '/data',
        component: () => import('@/views/course/data/index.vue'),
        name: 'data',
        meta: {
          title: '课程数据管理',
          hidden: false,
          icon: 'DataLine'
        }
      },
      {
        // 选课与学习记录管理
        path: '/selection',
        component: () => import('@/views/selection/index.vue'),
        name: 'selection',
        meta: {
          title: '选课与学习记录管理',
          hidden: false,
          icon: 'Clock'
        }
      },
      {
        // 课程评价管理
        path: '/evaluation',
        component: () => import('@/views/evaluation/index.vue'),
        name: 'evaluation',
        meta: {
          title: '课程评价管理',
          hidden: false,
          icon: 'Star'
        }
      }
    ]
  }
]