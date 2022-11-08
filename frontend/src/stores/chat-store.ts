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
  lastMessages: null | ChatMessage[],
  members: ChatUser[],
  avatar: string
}

const liveChannel = makeLiveServerChannel()

function pushNewRoomMessages (roomId: string, messages: ChatMessage[]) {
  if (!useChatStore().messages[roomId]) {
    useChatStore().messages[roomId] = {}
  }
  messages.forEach((msg) => {
    const date = new Date(msg.createdAt)
    msg.createdAt = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`
    useChatStore().messages[roomId][msg.internalId] = msg
  })
}

liveChannel.addEventListener('message', (e) => {
  // const msg = (e.data as { data: ChatMessage }).data
  switch (e.data.type) {
    case 'server:chat_message':
      pushNewRoomMessages(e.data.data.roomId, [e.data.data.data as ChatMessage])
      break
    default:
  }
})

export const useChatStore = defineStore('chatStore', {
  state: () => ({
    rooms: [] as ChatRoom[],
    messages: {} as { [key: string]: Record<string, ChatMessage> },
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
                if (!this.currentRoom.internalId) {
                  this.currentRoom = room
                }

                if (room.lastMessages) {
                  pushNewRoomMessages(room.internalId, room.lastMessages)
                }
              })
            }
            resolve(this.rooms)
          }).catch((e) => {
            // @todo handle error
            reject(e)
          })
      }), [])
    },
    async postMessage (roomId: string, message: string) {
      const response = await useUserStore().api.post(`${chatEndpoint}/message/${roomId}`, {
        message
      })

      if (response.data.success) {
        const message = response.data.message as ChatMessage
        pushNewRoomMessages(message.room.internalId, [message])
      }

      return response
    }
  }
})
