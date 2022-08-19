import { defineStore } from 'pinia'
import { useUserStore } from './user-store'

export const chatEndpoint = '/api/v1/chat'

export enum ChatRoomType {
  ONE_TO_ONE = 'one2one',
  PUBLIC = 'public'
}

export type ChatRoom = {
  id: number,
  name: string,
  type: ChatRoomType
}

export const useChatStore = defineStore('chatStore', {
  state: () => ({
    rooms: [] as ChatRoom[]
  }),
  actions: {
    async fetchRooms () {
      const response = await useUserStore().api.get(`${chatEndpoint}/my-rooms`)

      console.log('respose', response)
      // todo
    }
  }
})
