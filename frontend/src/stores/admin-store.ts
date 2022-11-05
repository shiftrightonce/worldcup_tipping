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
    }
  }
})
