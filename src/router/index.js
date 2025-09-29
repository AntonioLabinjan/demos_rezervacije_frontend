import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ProblemsPage from '../views/ProblemsPage.vue'
import ReservationsPage from '../views/ReservationsPage.vue'

const routes = [
  {
    path: '/',
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router