import { useAsyncState } from '@vueuse/core'
import { defineStore } from 'pinia'
import { useUserStore } from './user-store'

export type Score = {
  user: { id: number, username: string },
  totalPoints: number
}

const tipEndpoint = '/api/v1/tip'

export const useTipStore = defineStore('useTipStore', {
  state: () => ({
    scoreboard: [] as Score[]
  }),
  actions: {
    fetchScoreboard () {
      return useAsyncState(new Promise<Score[]>((resolve, reject) => {
        useUserStore().api.get(`${tipEndpoint}/scoreboard`)
          .then((response) => {
            console.log('scoreboard response data', response.data)
            console.log('scoreboard response', response)
            resolve(response.data.scoreboard as Array<Score>)
          }).catch((e) => {
            console.log('error scoreboard fetching', e)
            reject(e)
          })
      }), [])
    },
    fetchUserTotalScore (userId = 0) {
      const userStore = useUserStore()
      userId = userId || userStore.activeUser?.id as number
      useUserStore().api.get(`${tipEndpoint}/user-score/${userId}`)
        .then((response) => {
          console.log('total score response data', response.data)
          console.log('total score response', response)
        }).catch((e) => {
          console.log('error total score fetching', e)
        })
    }
  }
})
