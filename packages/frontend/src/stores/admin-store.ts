import { defineStore } from 'pinia'
import { useUserStore } from './user-store'

export const adminEndpoint = '/api/v1/admin'

export type PushMessage = {
  title: string
  icon?: string
  body: string
}

export const useAdminStore = defineStore('adminStore', {
  state: () => ({}),
  actions: {
    async sendPushMessage (message: PushMessage) {
      const userStore = useUserStore()
      if (userStore.isAdmin) {
        return await userStore.api.post(`${adminEndpoint}/push-message`, { message })
      }
      throw Error('You don\'t have permission to send push notification')
    },
    async totalUserCount () {
      const userStore = useUserStore()
      if (userStore.isAdmin) {
        return await userStore.api.post(`${adminEndpoint}/user-count`)
      }

      throw Error('You don\'t have permission to get total user count')
    },
    async totalTipCount () {
      const userStore = useUserStore()
      if (userStore.isAdmin) {
        return await userStore.api.post(`${adminEndpoint}/tip-count`)
      }

      throw Error('You don\'t have permission to get total tip count')
    }
  }
})
