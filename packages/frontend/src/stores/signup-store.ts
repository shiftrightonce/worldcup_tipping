import { defineStore } from 'pinia'
import axios from 'axios'
import { User, useUserStore } from './user-store'

export type SignupData = {
  username: string,
  password: string,
  confirmPassword: string,
  email: string
}

export const signupEndpoint = '/api/user'

export const useSignupStore = defineStore('sginupStore', {
  state: () => ({
    model: {
      username: '',
      password: '',
      confirmPassword: '',
      email: ''
    } as SignupData
  }),
  actions: {
    async signup () {
      try {
        const response = await axios.create().post(`${signupEndpoint}/signup`, this.model)
        if (response.status === 200) {
          useUserStore().setUser(response.data.user as User)
          return true
        }
        return false
      } catch (e) {
        return false
      }
    }
  }
})
