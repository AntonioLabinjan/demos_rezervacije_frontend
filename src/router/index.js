import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ProblemsPage from '../views/ProblemsPage.vue'
import ReservationsPage from '../views/ReservationsPage.vue'
import AuthPage from '@/views/AuthPage.vue'

const routes = [
  {
  path: '/',
  redirect: '/home'
},

  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/problems',
    name: 'Problems',
    component: ProblemsPage
  },
  {
    path: '/reservations',
    name: 'Reservations',
    component: ReservationsPage
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router