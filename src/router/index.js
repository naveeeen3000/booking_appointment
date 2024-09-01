import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: "/checkout",
      name: "checkout",
      component: CheckoutView
    },
    {
      path: "/confirmation",
      name: "confirmation",
      component: ConfirmationView
    }
  ]
})

export default router
