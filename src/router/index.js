import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PeliculasView from '../views/PeliculasView.vue'
import ClientesView from '../views/ClientesView.vue'
import EmpleadosView from '../views/EmpleadosView.vue'
import AlquilerView from '../views/AlquilerView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/peliculas',
    name: 'peliculas',
    component: PeliculasView
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: ClientesView
  },
  {
    path: '/empleados',
    name: 'empleados',
    component: EmpleadosView
  },
  {
    path: '/alquiler',
    name: 'alquiler',
    component: AlquilerView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
