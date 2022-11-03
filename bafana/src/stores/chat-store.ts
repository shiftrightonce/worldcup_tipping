import { useAsyncState } from '@vueuse/core'
import { defineStore } from 'pinia'
import makeLiveServerChannel from 'src/channels/liveserver_channel'
import { useUserStore } from './user-store'

export const chatEndpoint = '/api/v1/chat'

export enum ChatRoomType {
  ONE_TO_ONE = 'one2one',
  PUBLIC = 'public'
}

export type ChatUser = {
  id: number,
  internalId: string,
  username: string,
  avatar: string
}

export type ChatMessage = {
  id: number,
  internalId: string,
  from: ChatUser,
  message: string,
  room: {
    id: number,
    internalId: string,
    name: string,
    type: ChatRoomType
  },
  createdAt: string,
  updatedAt: string
}

export type ChatRoom = {
  id: number,
  internalId: string,
  name: string,
  type: ChatRoomType,
  lastMessage: null | ChatMessage,
  members: ChatUser[],
  avatar: string
}

const liveChannel = makeLiveServerChannel()

liveChannel.addEventListener('message', (e) => {
  // const msg = (e.data as { data: ChatMessage }).data
  switch (e.data.type) {
    case 'server:chat_message':
      console.log('chat room message', e.data.data.data)
      if (!useChatStore().messages[e.data.roomId]) {
        useChatStore().messages[e.data.roomId] = []
      }
      useChatStore().messages[e.data.roomId].push(e.data.data.data as ChatMessage)
      break
    default:
      console.log('okay....:::', e.data)
  }
})

export const useChatStore = defineStore('chatStore', {
  state: () => ({
    rooms: [] as ChatRoom[],
    messages: {} as { [key: string]: ChatMessage[] },
    currentRoom: {} as ChatRoom
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

                // if (room.lastMessage) {
                //   room.lastMessage.createdAt = new Date(room.lastMessage.createdAt)
                //   room.lastMessage.updatedAt = new Date(room.lastMessage.updatedAt)
                // }
              })
            }
            resolve(this.rooms)
            console.log('respose', response.data)
          }).catch((e) => {
            // @todo handle error
            reject(e)
          })
      }), [])
    },
    async postMessage (roomId: string, message: string) {
      return await useUserStore().api.post(`${chatEndpoint}/message/${roomId}`, {
        message
      })
    }
  }
})
