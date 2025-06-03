import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExploreView from '../views/ExploreView.vue'
import PeriodicalView from '../views/PeriodicalView.vue'
import GalleryView from '../views/GalleryView.vue'
import FAQView from '../views/FAQView.vue'
import ShopView from '../views/ShopView.vue'
import LocationsView from '@/views/LocationsView.vue'
import WeeklyView from '@/views/WeeklyView.vue'
import QuestionsView from '@/views/QuestionsView.vue'
import AccountView from '@/views/AccountView.vue'
import VerifyView from '@/views/VerifyView.vue'
import AdminView from '@/views/AdminView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/explore',
      name: 'explore',
      component: ExploreView,
    },
    {
      path: '/periodical',
      name: 'periodical',
      component: PeriodicalView,
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: GalleryView,
    },
    {
      path: '/FAQ',
      name: 'FAQ',
      component: FAQView,
    },
    {
      path: '/shop',
      name: 'shop',
      component: ShopView,
    },
    {
      path: '/locations',
      name: 'locations',
      component: LocationsView,
    },
    {
      path: '/weekly',
      name: 'weekly',
      component: WeeklyView,
    },
    {
      path: '/questions',
      name: 'questions',
      component: QuestionsView,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
    },
    {
      path: '/verify',
      name: 'verify',
      component: VerifyView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
  ],
})

export default router
