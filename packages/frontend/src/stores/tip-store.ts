import { useAsyncState } from '@vueuse/core'
import { defineStore } from 'pinia'
import { useUserStore } from './user-store'

export type Score = {
  user: { internalId: string, username: string, avatar: string },
  totalPoints: number,
  position: number,
  totalTips: number
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
            resolve(response.data.scoreboard as Array<Score>)
          }).catch((e) => {
            reject(e)
          })
      }), [])
    },
    async fetchMyTotalScore () {
      const response = await useUserStore().api.get(`${tipEndpoint}/my-score`)
      return response.data.score as Score
    }
  }
})
