import { useAsyncState } from '@vueuse/core'
import { defineStore } from 'pinia'
import { useUserTipStore } from './user-tip-store'
import { useUserStore } from './user-store'

export type Country = {
  id: number,
  groupPoints: number,
  image: string,
  imageSource: string,
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
  timestamp?: number,
  fullDate?: Date,
  isMatchOpen: boolean,
  countdown: string
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

let intervalId: ReturnType<typeof setInterval> | null = null

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
      this.activeMatches.forEach((match) => {
        const matchDate = new Date(`${match.date}T${match.time}`)
        const today = new Date()
        match.timestamp = matchDate.getTime() - today.getTime()
        match.countdown = ''
        match.isMatchOpen = match.status === MatchStatus.OPEN
      })

      if (!intervalId) {
        intervalId = setInterval(() => {
          this.activeMatches.forEach((match) => {
            if (!match.timestamp) {
              return
            }
            match.timestamp -= 1000

            if (match.timestamp <= 0) {
              match.isMatchOpen = false
              match.countdown = 'close'
            }

            const days = Math.floor(match.timestamp / (1000 * 60 * 60 * 24))
            const hours = Math.floor(match.timestamp % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
            const mins = Math.floor((match.timestamp % (1000 * 60 * 60)) / (1000 * 60))
            const secs = Math.floor((match.timestamp % (1000 * 60)) / 1000)
            match.countdown = `${days}d.${hours}h.${mins}m.${secs}s`
          })
        }, 1000)
      }

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
