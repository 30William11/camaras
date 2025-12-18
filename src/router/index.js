import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

// Public Views
import PublicHomeView from '@/views/public/PublicHomeView.vue'
import PublicAboutView from '@/views/public/PublicAboutView.vue'
import PublicServicesView from '@/views/public/PublicServicesView.vue'
import PublicContactView from '@/views/public/PublicContactView.vue'

// App Views
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import QuotesListView from '@/views/quotes/QuotesListView.vue'
import QuoteEditor from '@/views/quotes/QuoteEditor.vue'
import ClientsListView from '@/views/clients/ClientsListView.vue'
import ProductsListView from '@/views/products/ProductsListView.vue'
import CategoriesListView from '@/views/products/CategoriesListView.vue'
import UnitsListView from '@/views/products/UnitsListView.vue'
import ServicesListView from '@/views/services/ServicesListView.vue'
import UsersListView from '@/views/users/UsersListView.vue'

// Admin Views
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminContentView from '@/views/admin/AdminContentView.vue'
import AdminPublicServicesView from '@/views/admin/AdminPublicServicesView.vue'
import AdminMessagesView from '@/views/admin/AdminMessagesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public Routes
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', name: 'public.home', component: PublicHomeView },
        { path: 'about', name: 'public.about', component: PublicAboutView },
        { path: 'services', name: 'public.services', component: PublicServicesView },
        { path: 'contact', name: 'public.contact', component: PublicContactView },
      ],
    },

    // App Routes (Quotation System)
    {
      path: '/app/login',
      name: 'app.login',
      component: LoginView,
      meta: { guestOnly: true },
    },

    {
      path: '/app',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'app.dashboard', component: DashboardView },

        { path: 'quotes', name: 'app.quotes.index', component: QuotesListView },
        { path: 'quotes/new', name: 'app.quotes.create', component: QuoteEditor },
        { path: 'quotes/:id/edit', name: 'app.quotes.edit', component: QuoteEditor },

        { path: 'clients', name: 'app.clients.index', component: ClientsListView },

        { path: 'products', name: 'app.products.index', component: ProductsListView, meta: { role: 'admin' } },
        { path: 'products/categories', name: 'app.categories.index', component: CategoriesListView, meta: { role: 'admin' } },
        { path: 'products/units', name: 'app.units.index', component: UnitsListView, meta: { role: 'admin' } },

        { path: 'services', name: 'app.services.index', component: ServicesListView, meta: { role: 'admin' } },

        { path: 'users', name: 'app.users.index', component: UsersListView, meta: { role: 'superadmin' } },
      ],
    },

    // Admin Panel Routes
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: '', name: 'admin.dashboard', component: AdminDashboardView },
        { path: 'content', name: 'admin.content', component: AdminContentView },
        { path: 'services', name: 'admin.services', component: AdminPublicServicesView },
        { path: 'messages', name: 'admin.messages', component: AdminMessagesView },
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
    return next({ name: 'app.login' })
  }

  // rutas solo para invitados
  if (to.meta.guestOnly && isLogged) {
    return next({ name: 'app.dashboard' })
  }

  // restricción por rol
  if (to.meta.role) {
    if (to.meta.role === 'admin' && !['admin', 'superadmin'].includes(role)) {
      return next({ name: 'app.dashboard' })
    }
    if (to.meta.role === 'superadmin' && role !== 'superadmin') {
      return next({ name: 'app.dashboard' })
    }
  }

  next()
})

export default router

