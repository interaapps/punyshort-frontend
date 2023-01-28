import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/link/:id',
    name: 'link',
    component: () => import('../views/Link.vue')
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/Authorize.vue')
  },
  {
    path: '/link-test/:id',
    name: 'link-test',
    component: () => import('../views/FrontendRedirection.vue')
  },
  {
    path: '/error-page',
    name: 'error-page',
    component: () => import('../views/ErrorPage.vue')
  },
  {
    path: '/*',
    name: '404',
    component: () => import('../views/NotFound.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
