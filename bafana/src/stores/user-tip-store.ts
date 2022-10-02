import { useAsyncState } from '@vueuse/core'
import { defineStore } from 'pinia'
import { MatchRound, MatchStatus, Tip, useMatchStore } from './match-store'
import { useUserStore, userEndpoint } from './user-store'
import { computed } from 'vue'

export type UserTipState = {
  expanded: boolean
}

export const useUserTipStore = defineStore('userTipStore', {
  state: () => ({
    tips: {} as { [key: number]: { tip: Tip, state: UserTipState } },
    userStore: useUserStore()
  }),
  getters: {
    api: (state) => state.userStore.api,
    matchTip: (state) => {
      return (matchId: number) => state.tips[matchId] || null
    },
    canBotRun: (state) => {
      return (matchId: number) => {
        if (state.tips[matchId]) {
          const matchTip = state.tips[matchId]
          const match = useMatchStore().todayMatch(matchId)
          if (matchTip.tip.toWin.id || match.status !== MatchStatus.OPEN) {
            return false
          } else if (matchTip.tip.toWin.id || matchTip.tip.isLevel) {
            return false
          } else if (matchTip.tip.entryByBot) {
            return false
          }

          return true
        }
        return false
      }
    },
    countryAGoalTip: (state) => {
      return (matchId: number): number | string => {
        return (state.tips[matchId]) ? state.tips[matchId].tip.countryAToScore || '' : ''
      }
    },
    countryBGoalTip: (state) => {
      return (matchId: number): number | string => {
        return (state.tips[matchId]) ? state.tips[matchId].tip.countryBToScore || '' : ''
      }
    },
    countryAPenaltyGoalTip: (state) => {
      return (matchId: number): number | string => {
        return (state.tips[matchId]) ? state.tips[matchId].tip.countryAPenaltyToScore || '' : ''
      }
    },
    countryBPenaltyGoalTip: (state) => {
      return (matchId: number): number | string => {
        return (state.tips[matchId]) ? state.tips[matchId].tip.countryBPenaltyToScore || '' : ''
      }
    }
  },
  actions: {
    fetchMatchTip (matchId: number) {
      return useAsyncState(new Promise<{ tip: Tip, state: UserTipState }>((resolve, reject) => {
        if (this.tips[matchId]) {
          resolve(this.tips[matchId])
          return
        }
        this.api.get(`${userEndpoint}/tip/${matchId}`)
          .then((response) => {
            if (response.status !== 200) {
              return reject(response.data)
            }
            const state: UserTipState = setupUserTipState()
            this.tips[matchId] = { tip: response.data.tip as Tip, state }
            this.tips[matchId].tip.toWin = response.data.tip.toWin || { id: 0 }

            resolve(this.tips[matchId])
          })
      }), null)
    },
    setTip (matchId: number, tip: Tip) {
      if (!tip.toWin) {
        tip.toWin = { id: 0 }
      }
      if (!this.tips[matchId]) {
        const state: UserTipState = setupUserTipState()
        this.tips[matchId] = { tip, state }
      } else {
        this.tips[matchId].tip = tip
      }

      return this.tips[matchId].tip
    },
    getCountryAComputedGoalTip (matchId: number) {
      return computed({
        get: () => {
          return this.countryAGoalTip(matchId)
        },
        set: (goals: string | number) => {
          this.setCountryAGoalTip(matchId, goals)
        }
      })
    },
    getCountryBComputedGoalTip (matchId: number) {
      return computed({
        get: () => {
          return this.countryBGoalTip(matchId)
        },
        set: (goals: string | number) => {
          this.setCountryBGoalTip(matchId, goals)
        }
      })
    },
    getCountryAComputedPenaltyGoalTip (matchId: number) {
      return computed({
        get: () => {
          return this.countryAPenaltyGoalTip(matchId)
        },
        set: (goals: string | number) => {
          this.setCountryAPenaltyGoalTip(matchId, goals)
        }
      })
    },
    getCountryBComputedPenaltyGoalTip (matchId: number) {
      return computed({
        get: () => {
          return this.countryBPenaltyGoalTip(matchId)
        },
        set: (goals: string | number) => {
          this.setCountryBPenaltyGoalTip(matchId, goals)
        }
      })
    },
    getCountryAComputedToWinTip (matchId: number) {
      const match = useMatchStore().todayMatch(matchId)
      return computed({
        get: () => {
          return this.tips[matchId].tip.toWin.id === match.countryA.id || this.tips[matchId].tip.isLevel
        },
        set: (val: boolean) => {
          this.tips[matchId].tip.toWin = (val) ? match.countryA : { id: 0 }
        }
      })
    },
    getCountryBComputedToWinTip (matchId: number) {
      const match = useMatchStore().todayMatch(matchId)
      return computed({
        get: () => {
          return this.tips[matchId].tip.toWin.id === match.countryB.id || this.tips[matchId].tip.isLevel
        },
        set: (val: boolean) => {
          this.tips[matchId].tip.toWin = (val) ? match.countryB : { id: 0 }
        }
      })
    },
    setCountryAGoalTip (matchId: number, goals: string | number) {
      if (this.tips[matchId]) {
        this.tips[matchId].tip.countryAToScore = goals as number
        this.figureOutWinner(matchId)
      }
    },
    setCountryBGoalTip (matchId: number, goals: string | number) {
      if (this.tips[matchId]) {
        this.tips[matchId].tip.countryBToScore = goals as number
        this.figureOutWinner(matchId)
      }
    },
    setCountryAPenaltyGoalTip (matchId: number, goals: string | number) {
      if (this.tips[matchId]) {
        this.tips[matchId].tip.countryAPenaltyToScore = goals as number
        this.toggleToPenalty(matchId)
      }
    },
    setCountryBPenaltyGoalTip (matchId: number, goals: string | number) {
      if (this.tips[matchId]) {
        this.tips[matchId].tip.countryBPenaltyToScore = goals as number
        this.toggleToPenalty(matchId)
      }
    },
    generateBotEntries (matchId: number) {
      const maxGoals = 12
      const match = useMatchStore().todayMatch(matchId)
      this.tips[matchId].tip.countryAToScore = Math.floor(Math.random() * maxGoals)
      this.tips[matchId].tip.countryBToScore = Math.floor(Math.random() * maxGoals)

      this.tips[matchId].tip.entryByBot = true

      if (match.round !== MatchRound.GROUP) {
        const equalScore = Math.floor(Math.random() * maxGoals)
        if (equalScore % 2 === 0) {
          this.tips[matchId].tip.countryAToScore = equalScore
          this.tips[matchId].tip.countryBToScore = equalScore
        }
        this.tips[matchId].tip.toPenalty = this.tips[matchId].tip.countryAToScore === this.tips[matchId].tip.countryBToScore

        if (this.tips[matchId].tip.toPenalty) {
          this.tips[matchId].tip.countryAPenaltyToScore = Math.floor(Math.random() * 8)
          this.tips[matchId].tip.countryBPenaltyToScore = Math.floor(Math.random() * 8)
        }
      }
      this.figureOutWinner(matchId)
    },
    toggleToPenalty (matchId: number) {
      const match = useMatchStore().todayMatch(matchId)
      if (this.tips[matchId].tip.countryAPenaltyToScore || this.tips[matchId].tip.countryBPenaltyToScore) {
        this.tips[matchId].tip.toPenalty = true
        this.tips[matchId].tip.isLevel = false

        this.tips[matchId].tip.toWin = (this.tips[matchId].tip.countryAPenaltyToScore > this.tips[matchId].tip.countryBPenaltyToScore) ? match.countryA : match.countryB
      } else if (!this.tips[matchId].tip.countryAPenaltyToScore && !this.tips[matchId].tip.countryBPenaltyToScore) {
        this.tips[matchId].tip.toPenalty = false
        this.figureOutWinner(matchId)
      }
    },
    figureOutWinner (matchId: number) {
      const match = useMatchStore().todayMatch(matchId)
      if (this.tips[matchId]) {
        if (this.tips[matchId].tip.countryAToScore !== this.tips[matchId].tip.countryBToScore) {
          this.tips[matchId].tip.toWin = (this.tips[matchId].tip.countryAToScore > this.tips[matchId].tip.countryBToScore) ? match.countryA : match.countryB
          this.tips[matchId].tip.isLevel = false
        } else {
          this.tips[matchId].tip.toWin = { id: 0 }
          this.tips[matchId].tip.isLevel = true
        }
      }
    }
  }
})

const setupUserTipState = (): UserTipState => {
  const state = {
    expanded: false
  }
  return state
}
