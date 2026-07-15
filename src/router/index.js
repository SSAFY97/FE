import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import TourismPage from '@/pages/TourismPage.vue'
import DirectionsPage from '@/pages/DirectionsPage.vue'
import CommunityPage from '@/pages/CommunityPage.vue'
import PostWritePage from '@/pages/PostWritePage.vue'
import PostDetailPage from '@/pages/PostDetailPage.vue'
import PostEditPage from '@/pages/PostEditPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', name: 'home', component: HomePage },
        { path: 'tourism', name: 'tourism', component: TourismPage },
        { path: 'directions', name: 'directions', component: DirectionsPage },
        { path: 'community', name: 'community', component: CommunityPage },
        { path: 'community/write', name: 'post-write', component: PostWritePage },
        { path: 'community/:id', name: 'post-detail', component: PostDetailPage },
        {
          path: 'community/:id/edit',
          name: 'post-edit',
          component: PostEditPage,
        },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
