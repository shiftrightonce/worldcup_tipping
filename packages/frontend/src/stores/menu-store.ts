import { defineStore } from 'pinia'
import { useShare } from '@vueuse/core'
export type MenuItem = {
  label: string,
  to: { name: string },
  icon: string,
  color: string
}

const scoreboardMenuItem = {
  label: 'Scoreboard',
  to: { name: 'scoreboard' },
  icon: 'format_list_numbered',
  color: 'secondary'
}
const contactUsMenuItem = {
  label: 'Contact Me',
  to: { name: 'contact-us' },
  icon: 'alternate_email',
  color: 'primary'
}

const prizesMenuItem = {
  label: 'Prizes',
  to: { name: 'prizes' },
  icon: 'military_tech',
  color: 'primary'
}

const logoutMenuItem = {
  label: 'Logout',
  to: { name: 'logout' },
  icon: 'logout',
  color: 'primary'
}

const { share, isSupported } = useShare()

export const useMenuStore = defineStore('menu', {
  state: () => ({
    scoreboardMenuItem,
    contactUsMenuItem,
    prizesMenuItem,
    logoutMenuItem,
    public: [
      {
        label: 'Home',
        to: { name: 'home' },
        icon: 'home',
        color: 'primary'
      },
      {
        label: 'Learn',
        to: { name: 'learn' },
        icon: 'info',
        color: 'primary'
      },
      contactUsMenuItem,
      {
        label: 'Prizes',
        to: { name: 'prizes' },
        icon: 'military_tech',
        color: 'primary'
      },
      {
        label: 'Login',
        to: { name: 'login' },
        icon: 'login',
        color: 'primary'
      }
    ],
    main: [
      scoreboardMenuItem,
      {
        label: 'Active Matches',
        to: { name: 'active-matches' },
        icon: 'circle_notifications',
        color: 'primary'
      },
      {
        label: 'Past Matches',
        to: { name: 'past-matches' },
        icon: 'notifications_paused',
        color: 'primary'
      },
      {
        label: 'Group Chat',
        to: { name: 'group-chat' },
        icon: 'message',
        color: 'primary'
      },
      {
        label: 'Learn',
        to: { name: 'learn' },
        icon: 'info',
        color: 'primary'
      },
      contactUsMenuItem,
      prizesMenuItem
    ] as MenuItem[],
    user: [
      {
        label: 'Account',
        to: { name: 'account' },
        icon: 'account_circle',
        color: 'primary'
      },
      logoutMenuItem
    ] as MenuItem[],
    admin: [
      {
        label: 'Matches',
        to: { name: 'admin-matches' },
        icon: 'sports_soccer',
        color: 'primary'
      },
      {
        label: 'Push Nofication',
        to: { name: 'push-notification' },
        icon: 'notifications',
        color: 'primary'
      },
      {
        label: 'Group Round Points',
        to: { name: 'group-round-points' },
        icon: 'timeline',
        color: 'primary'
      },
      {
        label: 'Users',
        to: { name: 'admin-users' },
        icon: 'people',
        color: 'primary'
      },
      {
        label: 'Statistics',
        to: { name: 'admin-stats' },
        icon: 'bar_chart',
        color: 'primary'
      }
    ] as MenuItem[]
  }),
  getters: {
    mainMenuItems: (state) => state.main
  },
  actions: {
    shareApp () {
      if (isSupported.value) {
        share({
          title: 'Invitation',
          text: 'Come join me tip, for free, on this awesome web app',
          url: location.href
        })
      }
    },
    shareIsSupported () {
      return isSupported.value
    }
  }
})
