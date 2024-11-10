import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from "@/components/layouts/AppLayout.vue";
import WorkspaceLayout from "@/components/layouts/WorkspaceLayout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/workspace/:workspace',
      component: WorkspaceLayout,
      children: [
        {
          path: '',
          name: 'workspace-home',
          component: () => import('../views/workspace/WorkspaceLinks.vue')
        },
        {
          path: 'link/:id',
          name: 'workspace-link',
          component: () => import('@/views/Link.vue')
        },
      ]
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/Home.vue')
        },
        {
          path: 'link/:id',
          name: 'link',
          component: () => import('@/views/Link.vue')
        },
        {
          path: 'auth',
          name: 'auth',
          component: () => import('../views/Authorize.vue')
        },
        {
          path: 'link-test/:id',
          name: 'link-test',
          component: () => import('../views/FrontendRedirection.vue')
        },
        {
          path: 'error-page',
          name: 'error-page',
          component: () => import('../views/ErrorPage.vue')
        },
        {
          path: '*',
          name: '404',
          component: () => import('../views/NotFound.vue')
        }
      ]
  }

  ]

});

export default router;
