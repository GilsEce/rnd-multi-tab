import { createRouter, createWebHistory } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: () => {
        const sessionId = uuidv4()
        return { name: 'dashboard', params: { sessionId } }
      },
    },
    {
      path: '/tab/:sessionId',
      component: () => import('../layouts/TabLayout.vue'),
      children: [
        { path: '', redirect: { name: 'dashboard' } },
        { path: 'dashboard', name: 'dashboard', component: () => import('../pages/DashboardPage.vue') },
        { path: 'orders', name: 'orders', component: () => import('../pages/OrdersPage.vue') },
        { path: 'products', name: 'products', component: () => import('../pages/ProductsPage.vue') },
        { path: 'customers', name: 'customers', component: () => import('../pages/CustomersPage.vue') },
        { path: 'reports', name: 'reports', component: () => import('../pages/ReportsPage.vue') },
        {
          path: 'application-form',
          name: 'application-form',
          component: () => import('../pages/ApplicationFormPage.vue'),
        },
      ],
    },
  ],
})

export default router
