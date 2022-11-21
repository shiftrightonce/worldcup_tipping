import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import axios, { AxiosInstance } from 'axios'
import { Tip } from './match-store'
import { io, Socket } from 'socket.io-client'
import makeLiveServerChannel from 'src/channels/liveserver_channel'

const tokenKey = '_t'
const userKey = '_user'
export const userEndpoint = '/api/v1/user'

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export type User = {
  id: number,
  internalId: string,
  token: string,
  username: string,
  avatar: string,
  role: UserRole
}

export type UserTipState = {
  expanded: boolean
}

const LAST_PUSH_SUBSCRIPTION_TS = 'last_push_subscription_ts'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    activeToken: LocalStorage.getItem(tokenKey),
    activeUser: LocalStorage.getItem(userKey) as User | null,
    vapid: LocalStorage.getItem('vapid') || '',
    _api: null as AxiosInstance | null,
    tips: {} as { [key: number]: { tip: Tip, state: UserTipState } },
    socket: null as Socket | null
  }),
  getters: {
    isLogin: (state) => !!state.activeToken,
    token: (state) => state.activeToken,
    user: (state) => state.activeUser,
    isAdmin: (state) => state.activeUser?.role === UserRole.ADMIN,
    api: (state) => {
      if (state.activeToken && !state._api) {
        state._api = axios.create({
          headers: {
            Authorization: `Bearer ${state.activeToken}`
          }
        })
        return state._api
      }
      return axios.create()
    },
    matchTip: (state) => {
      return (matchId: number) => state.tips[matchId] || null
    }
  },
  actions: {
    setToken (token: string) {
      this.activeToken = token
      LocalStorage.set(tokenKey, token)
    },
    setUser (user: User) {
      this.activeUser = user
      LocalStorage.set(userKey, user)
      this.setToken(user.token)
    },
    setVapid (key: string) {
      LocalStorage.set('vapid', key)
      this.vapid = key
    },
    async login (username: string, password: string) {
      const response = await axios.post('/api/user/login', {
        username,
        password
      })

      if (response.status === 200) {
        this.setUser(response.data.user as User)
        this.setVapid(response.data.pushVapid)
        return true
      }
    },
    setupSocket () {
      if (!this.socket) {
        const liveChannel = makeLiveServerChannel()
        this.socket = io({
          auth: {
            token: this.token
          }
        })
        this.socket.io.on('open', () => {
          liveChannel.postMessage({ type: 'open', data: { time: Date.now() } })
        })
        this.socket.on('connection_error', (error) => {
          liveChannel.postMessage({ type: 'connection_error', data: error })
        })
        this.socket.on('server:time', (data) => {
          liveChannel.postMessage({ type: 'server:time', data })
        })
        this.socket.on('server:room_event', (data) => {
          liveChannel.postMessage({ type: 'server:chat_message', data })
        })
        this.socket.on('server:notification_message', (data) => {
          if (Notification.permission === 'granted') {
            const message = data.data as { title: string, icon: string, body: string }
            const notification = new Notification(message.title, { ...message, silent: false, vibrate: 200 })
          }
        })
      }
    },
    async logout () {
      try {
        const response = await axios.get('/api/user/logout')
        LocalStorage.clear()
        this.activeToken = ''
        this.activeUser = null
        this.vapid = ''
        return response.status === 200
      } catch (e) {
        return false
      }
    },
    async requestPasswordReset (email: string) {
      return await axios.post('/api/reset-password-request', {
        email
      })
    },
    async loginWithToken (token: string) {
      const response = await axios.get(`/api/token-login/${token}`)
      if (response.status === 200) {
        this.setUser(response.data.user as User)
        this.setVapid(response.data.pushVapid)
        return true
      }
      return false
    },
    async prizes () {
      const response = await axios.get('/api/prizes')
      return response.data.prizes as Array<{ title: string, image: string, position: number, description: string }>
    },
    async getTip (match: number) {
      if (this.tips[match]) {
        return this.tips[match]
      }
      const response = await this.api.get(`${userEndpoint}/tip/${match}`)

      if (response.status === 200) {
        const state: UserTipState = {
          expanded: false
        }
        this.tips[match] = { tip: response.data.tip as Tip, state }
        this.tips[match].tip.toWin = response.data.tip || { id: 0 }
      } else {
        throw Error(response.data.message)
      }

      return this.matchTip(match)
    },

    async setTip (match: number, entry: { tip: Tip, state: UserTipState }) {
      this.tips[match] = entry
    },
    async subscribeToNotifications (data: Record<string, unknown>) {
      const response = await this.api.post(`${userEndpoint}/push-subscribe`, data)
      LocalStorage.set(LAST_PUSH_SUBSCRIPTION_TS, Date.now())
      return response.data
    },
    async setupNotificationSubscription () {
      if (!('Notification' in window)) {
        return
      }

      const channel = new BroadcastChannel('world-cup-tipping')
      channel.onmessage = (event) => {
        if (event.data.type) {
          switch (event.data.type) {
            case 'client:subscription_response':
              this.subscribeToNotifications(event.data.data)
              break
          }
        }
      }

      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then((response) => {
          if (response === 'granted') {
            channel.postMessage({ type: 'service:subscribe_to_notification', data: { vapid: this.vapid } })
            // channel.close()
          }
        })
      } else {
        const lastTimestamp = LocalStorage.getItem(LAST_PUSH_SUBSCRIPTION_TS) || 0
        const todayTs = Date.now()
        const aDay = 1000 * 3600 * 24

        if (!lastTimestamp || (Math.floor((todayTs - parseInt(lastTimestamp as string, 10))) / aDay) >= 80) {
          channel.postMessage({ type: 'service:subscribe_to_notification', data: { vapid: this.vapid } })
        } else {
          channel.close()
        }
      }
    },
    async getMyInformation () {
      const response = await axios.get(`${userEndpoint}/my-info`)
      return response.data.user as User & { email: string }
    },
    async updateMyData (data: Record<string, unknown>) {
      const response = await axios.put(`${userEndpoint}/my-data`, data)
      const user = response.data.user as User
      LocalStorage.clear()
      this.activeToken = ''
      this.activeUser = null
      this.setUser(user)

      return user
    },
    async deleteMyAccount () {
      try {
        const response = await axios.delete(`${userEndpoint}/my-account`)
        return response.status === 200
      } catch (e) {
        return false
      }
    }
  }
})
