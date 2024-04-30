import { createRouter, createWebHistory } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/index.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/goods',
      children: [
        {
          path: '/home',
          name: 'HomeView',
          component: () => import('@/views/home/HomeView.vue')
        },
        {
          path: '/goods',
          name: 'GoodsView',
          component: () => import('@/views/goods/GoodsView.vue')
        },
        {
          path: '/category',
          name: 'CategoryView',
          component: () => import('@/views/category/CategoryView.vue')
        },
        {
          path: '/order',
          name: 'OrderView',
          component: () => import('@/views/order/OrderView.vue')
        },
        {
          path: '/afterSales',
          name: 'AfterSalesView',
          component: () => import('@/views/order/AfterSalesView.vue')
        },
        {
          path: '/tag',
          name: 'TagView',
          component: () => import('@/views/tag/TagView.vue')
        },
        {
          path: '/analysis',
          name: 'AnalysisView',
          component: () => import('@/views/analysis/AnalysisView.vue')
        },
        {
          path: '/user',
          name: 'UserView',
          component: () => import('@/views/user/UserView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'LoginView',
      component: () => import('@/views/login/LoginView.vue')
    }
  ]
})

const noAuthUrls = '/login'

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (noAuthUrls === to.path || (userStore.isLogin && userStore.isAdmin)) {
    return true
  }
  if (!userStore.isAdmin) {
    message.error('该账号不是管理员账号')
  } else {
    message.error('请登录后再试')
  }
  router.push({
    path: '/login',
    query: {
      backUrl: to.fullPath
    }
  })
  return false
})

export default router
