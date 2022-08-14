import { useAsyncState } from '@vueuse/core'
import { defineStore } from 'pinia'
import { useUserTipStore } from './user-tip-store'
import { useUserStore } from './user-store'

export type Country = {
  id: number,
  groupPoints: number,
  image: string,
  name: string,
  short: string
}

export enum MatchStatus {
  PENDING = 'pending', // The match is not ready for anything
  OPEN = 'open', // The match is open for tipping
  CLOSE = 'close', // The match is close for tipping
  SCORE_ENTERED = 'score_entered', // Final scores entered and it is time to calculate users points
  COMPLETED = 'completed' // Match is and everything around it is completed
}

export enum MatchRound {
  GROUP = 'group',
  ROUND_16 = 'round_16',
  ROUND_8 = 'round_8',
  ROUND_4 = 'round_4',
  THIRD_PLACE = 'third_place',
  FINAL = 'final'
}

export type Match = {
  id: number,
  year: number,
  number: number,
  status: MatchStatus,
  countryA: Country,
  countryB: Country,
  penalty: boolean,
  date: string,
  round: MatchRound,
  time: string
  winner?: Country
  countryAGoals: number,
  countryBGoals: number,
  countryAPenaltyGoals: number,
  countryBPenaltyGoals: number,
}

export type Tip = {
  id: number,
  countryAPenaltyToScore: number,
  countryAToScore: number,
  countryBPenaltyToScore: number,
  countryBToScore: number,
  entryByBot: boolean,
  points: number,
  toPenalty: boolean,
  isLevel: boolean,
  toWin: { id: number },
  match: Match
}

export const matchEndpoint = '/api/v1/match'

export const useMatchStore = defineStore('matchStore', {
  state: () => ({
    activeMatches: [] as Match[],
    completedMatches: [] as Match[]
  }),
  getters: {
    today: (state) => state.activeMatches,
    completed: (state) => state.completedMatches
  },
  actions: {
    async getTodayMatches () {
      const userStore = useUserStore()
      const response = await userStore.api.get(`${matchEndpoint}/todays`)
      this.activeMatches = response.data as Match[]
      return this.today
    },
    fetchCompletedMatches () {
      return useAsyncState(new Promise<Match[]>((resolve, reject) => {
        const userStore = useUserStore()
        userStore.api.get(`${matchEndpoint}/completed`)
          .then((response) => {
            this.completedMatches = response.data as Match[]
            resolve(this.completed)
          }).catch(reject)
      }), [])
    },
    async placeTip (match: number) {
      const userStore = useUserStore()
      const tip = useUserTipStore().matchTip(match)
      return await userStore.api.post(`${matchEndpoint}/place-tip`, { ...tip.tip })
    }
  }
})
