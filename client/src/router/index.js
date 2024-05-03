import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('../views/PreviewIndex/index.vue'),
    },
    {
      path: '/shopCar',
      name: 'shopCar',
      component: () => import('../views/PreviewIndex/ShoppingCar.vue')
    },
    {
      path: '/collect',
      name: 'collect',
      component: () => import('../views/PreviewIndex/Collect.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/PreviewIndex/YouProfile.vue')
    },
    {
      path: '/manService',
      name: 'manService',
      component: () => import('../views/PreviewIndex/Connection/ManService.vue'),
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('../views/PreviewIndex/Connection/Feedback.vue'),
    },
    {
        path: '/productDetail',
        name: 'productDetail',
        component: () => import('../views/PreviewIndex/ProductDetail.vue'),
    },
    {
        path: '/news',
        name: 'news',
        component: () => import('../views/PreviewIndex/News.vue'),
    },
  
  ]
})

export { router}
