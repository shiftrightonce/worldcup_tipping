import { useAsyncState } from '@vueuse/core'
import { defineStore } from 'pinia'
import { useUserStore } from './user-store'

export const chatEndpoint = '/api/v1/chat'

export enum ChatRoomType {
  ONE_TO_ONE = 'one2one',
  PUBLIC = 'public'
}

export type ChatUser = {
  id: number,
  username: string,
  avatar: string
}

export type ChatMessage = {
  id: number,
  createdAt: Date,
  from: ChatUser,
  message: string,
  room: { id: number, name: string, type: ChatRoomType },
  updatedAt: Date
}

export type ChatRoom = {
  id: number,
  name: string,
  type: ChatRoomType,
  lastMessage: null | ChatMessage,
  members: ChatUser[],
  avatar: string
}

export const useChatStore = defineStore('chatStore', {
  state: () => ({
    rooms: [] as ChatRoom[]
  }),
  actions: {
    fetchRooms () {
      return useAsyncState(new Promise<ChatRoom[]>((resolve, reject) => {
        useUserStore().api.get(`${chatEndpoint}/my-rooms`)
          .then((response) => {
            if (response.data.success) {
              this.rooms = response.data.rooms as ChatRoom[]
              this.rooms.forEach((room) => {
                // if (room.type === ChatRoomType.PUBLIC) {
                //   room.avatar = '/ph/group.png'
                // } else if (room.members.length > 0) {
                //   room.avatar = `/static/user/${room.members[0].username}.png`
                //   room.name = room.members[0].username
                //   room.members.forEach((member) => {
                //     member.avatar = `/static/user/${room.members[0].username}.png`
                //   })
                // } else {
                //   room.avatar = '/ph/noimage.png'
                // }

                if (room.lastMessage) {
                  room.lastMessage.createdAt = new Date(room.lastMessage.createdAt)
                  room.lastMessage.updatedAt = new Date(room.lastMessage.updatedAt)
                }
              })
            }
            resolve(this.rooms)
            console.log('respose', response.data)
          }).catch((e) => {
            // @todo handle error
            reject(e)
          })
      }), [])
    }
  }
})
