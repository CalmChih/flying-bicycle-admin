import { createRouter, createWebHistory } from 'vue-router'

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
          component: () => import('@/views/category/CateGoryView.vue')
        },
        {
          path: '/order',
          name: 'OrderView',
          component: () => import('@/views/order/OrderView.vue')
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

export default router
