import { defineStore } from 'pinia'
export type MenuItem = {
  label: string,
  to: { name: string },
  icon: string,
  color: string
}

export const useMenuStore = defineStore('menu', {
  state: () => ({
    main: [
      {
        label: 'Scoreboard',
        to: { name: 'scoreboard' },
        icon: 'format_list_numbered',
        color: 'secondary'
      },
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
      }
    ] as MenuItem[]
  }),
  getters: {
    mainMenuItems: (state) => state.main
  }
})
