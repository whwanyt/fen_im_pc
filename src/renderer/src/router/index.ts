import { useUserStore } from '@renderer/store/user'
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/home.vue'
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        { path: '/chat', name: 'chatPage', component: () => import('../views/chat/index.vue') },
        { path: '/about', component: () => import('../views/about.vue') }
      ]
    },
    { path: '/login', component: () => import('../views/login.vue') },
    { path: '/file', component: () => import('../views/file/index.vue') },
    { path: '/video', component: () => import('../views/video/index.vue') },
    { path: '/friend', component: () => import('../views/friend.vue') }
  ]
})

router.beforeEach((to, _from, next) => {
  const user = useUserStore()
  if (user.getToken) {
    if (to.path === '/login') {
      next()
    } else {
      next()
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      router.replace('/login')
    }
  }
})
