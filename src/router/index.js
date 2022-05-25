import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Inbox from '../views/Inbox.vue'
import PumpBoat from '../views/PumpBoat.vue'
import TravelDestination from '../views/TravelDestination.vue'
import Settings from '../views/Settings.vue'
import EditDestination from '../views/EditDestination.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }, 
  {
    path: '/settings/:id',
    name: 'settings',
    component: Settings
  }, 
  {
    path: '/profile/:id',
    name: 'profile',
    component: Profile
  }, 
  {
    path: '/inbox/:id',
    name: 'inbox',
    component: Inbox
  }, 
  {
    path: '/pumpboat',
    name: 'pumpboat',
    component: PumpBoat
  }, 
  {
    path: '/traveldestination',
    name: 'traveldestination',
    component: TravelDestination
  }, 
  {
    path: '/edit-destination/:id',
    name: 'edit-destination',
    component: EditDestination
  }, 
  {
    path: '/about',
    name: 'about', 
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
