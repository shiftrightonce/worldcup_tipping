import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), name: 'home' },
      { path: 'forgot-login', component: () => import('pages/ForgotLoginPage.vue'), name: 'forgot-login' },
      { path: 'signup', component: () => import('pages/SignupPage.vue'), name: 'signup' },
      { path: 'login', component: () => import('pages/LoginPage.vue'), name: 'login' },
      { path: 'prizes', component: () => import('pages/PrizePage.vue'), name: 'prizes' },
      { path: 'learn', component: () => import('pages/LearnPage.vue'), name: 'learn' },
      { path: 'contact-us', component: () => import('pages/ContactPage.vue'), name: 'contact-us' }
    ]
  },
  {
    path: '/secure',
    component: () => import('layouts/PlaneLayout.vue'),
    children: [
      { path: 'scoreboard', component: () => import('pages/ScoreBoardPage.vue'), name: 'scoreboard' },
      { path: 'active-matches', component: () => import('pages/ActiveMatchesPage.vue'), name: 'active-matches' },
      { path: 'past-matches', component: () => import('pages/PastMatchesPage.vue'), name: 'past-matches' },
      { path: 'logout', component: () => import('pages/LogoutPage.vue'), name: 'logout' },
      { path: 'account', component: () => import('pages/AccountPage.vue'), name: 'account' }
    ]
  },
  {
    path: '/secure/chat',
    component: () => import('layouts/GroupChatLayout.vue'),
    children: [
      { path: '', component: () => import('pages/GroupChatPage.vue'), name: 'group-chat' }
    ]
  },
  {
    path: '/secure/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: 'matches', component: () => import('pages/admin/MatchesPage.vue'), name: 'admin-matches' },
      { path: 'group-round-points', component: () => import('pages/admin/GroupRoundPointsPage.vue'), name: 'group-round-points' },
      { path: 'notification', component: () => import('pages/admin/PushNotificationPage.vue'), name: 'push-notification' },
      { path: 'users', component: () => import('pages/admin/UsersPage.vue'), name: 'admin-users' },
      { path: 'stats', component: () => import('pages/admin/StatsPage.vue'), name: 'admin-stats' }
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
