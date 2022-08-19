import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), name: 'home' },
      { path: 'forgot-login', component: () => import('pages/ForgotLoginPage.vue'), name: 'forgot-login' },
      { path: 'signup', component: () => import('pages/SignupPage.vue'), name: 'signup' }
    ]
  },
  {
    path: '/secure',
    component: () => import('layouts/PlaneLayout.vue'),
    children: [
      { path: 'scoreboard', component: () => import('pages/ScoreBoardPage.vue'), name: 'scoreboard' },
      { path: 'active-matches', component: () => import('pages/ActiveMatchesPage.vue'), name: 'active-matches' },
      { path: 'past-matches', component: () => import('pages/PastMatchesPage.vue'), name: 'past-matches' },
      { path: 'logout', component: () => import('pages/LogoutPage.vue'), name: 'logout' }
    ]
  },
  {
    path: '/secure/chat',
    component: () => import('layouts/GroupChatLayout.vue'),
    children: [
      { path: '', component: () => import('pages/GroupChatPage.vue'), name: 'group-chat' }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
