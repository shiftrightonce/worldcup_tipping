import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import axios, { AxiosInstance } from 'axios'
import { Tip } from './match-store'
import { io, Socket } from 'socket.io-client'

const tokenKey = '_t'
const userKey = '_user'
export const userEndpoint = '/api/v1/user'

export type User = {
  id: number,
  token: string,
  username: string,
}

export type UserTipState = {
  expanded: boolean
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    activeToken: LocalStorage.getItem(tokenKey),
    activeUser: LocalStorage.getItem(userKey) as User | null,
    _api: null as AxiosInstance | null,
    tips: {} as { [key: number]: { tip: Tip, state: UserTipState } },
    socket: null as Socket | null
  }),
  getters: {
    isLogin: (state) => !!state.activeToken,
    token: (state) => state.activeToken,
    user: (state) => state.activeUser,
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
    async login (username: string, password: string) {
      try {
        const response = await axios.post('/api/user/login', {
          username,
          password
        })
        if (response.status === 200) {
          this.setUser(response.data.user as User)
          return true
        }
        return false
      } catch (e) {
        return false
      }
    },
    setupSocket () {
      if (!this.socket) {
        this.socket = io({
          auth: {
            token: this.token
          }
        })
        this.socket.io.on('open', () => {
          console.log('we are connected')
        })
        this.socket.on('connection_error', (error) => {
          console.log('could not connect', error)
        })
        this.socket.on('server:time', (data) => {
          console.log('server time', data)
        })
      }
    },
    async logout () {
      try {
        const response = await axios.get('/api/user/logout')
        LocalStorage.clear()
        return response.status === 200
      } catch (e) {
        return false
      }
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
    }
  }
})
