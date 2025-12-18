import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'

// Vistas placeholder (las creamos en el siguiente paso)
import QuotesListView from '@/views/quotes/QuotesListView.vue'
import QuoteEditor from '@/views/quotes/QuoteEditor.vue'
import ClientsListView from '@/views/clients/ClientsListView.vue'
import ProductsListView from '@/views/products/ProductsListView.vue'
import CategoriesListView from '@/views/products/CategoriesListView.vue'
import UnitsListView from '@/views/products/UnitsListView.vue'
import ServicesListView from '@/views/services/ServicesListView.vue'
import UsersListView from '@/views/users/UsersListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },

    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'dashboard', component: DashboardView },

        { path: 'quotes', name: 'quotes.index', component: QuotesListView },
        { path: 'quotes/new', name: 'quotes.create', component: QuoteEditor },
        { path: 'quotes/:id/edit', name: 'quotes.edit', component: QuoteEditor },

        { path: 'clients', name: 'clients.index', component: ClientsListView },

        { path: 'products', name: 'products.index', component: ProductsListView, meta: { role: 'admin' } },
        { path: 'products/categories', name: 'categories.index', component: CategoriesListView, meta: { role: 'admin' } },
        { path: 'products/units', name: 'units.index', component: UnitsListView, meta: { role: 'admin' } },

        { path: 'services', name: 'services.index', component: ServicesListView, meta: { role: 'admin' } },

        { path: 'users', name: 'users.index', component: UsersListView, meta: { role: 'superadmin' } },
      ],
    },
  ],
})

// Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.loading) {
    await authStore.init()
  }

  const isLogged = !!authStore.user
  const role = authStore.profile?.role

  // rutas que requieren login
  if (to.meta.requiresAuth && !isLogged) {
    return next({ name: 'login' })
  }

  // rutas solo para invitados
  if (to.meta.guestOnly && isLogged) {
    return next({ name: 'dashboard' })
  }

  // restricción por rol
  if (to.meta.role) {
    if (to.meta.role === 'admin' && !['admin', 'superadmin'].includes(role)) {
      return next({ name: 'dashboard' })
    }
    if (to.meta.role === 'superadmin' && role !== 'superadmin') {
      return next({ name: 'dashboard' })
    }
  }

  next()
})

export default router
