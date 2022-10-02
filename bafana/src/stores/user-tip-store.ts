import { useAsyncState } from '@vueuse/core'
import { defineStore } from 'pinia'
import { MatchRound, MatchStatus, Tip } from './match-store'
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
          if (matchTip.tip.toWin.id || matchTip.tip.match.status !== MatchStatus.OPEN) {
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
    fetchMatchTip (match: number) {
      return useAsyncState(new Promise<{ tip: Tip, state: UserTipState }>((resolve, reject) => {
        if (this.tips[match]) {
          resolve(this.tips[match])
          return
        }
        this.api.get(`${userEndpoint}/tip/${match}`)
          .then((response) => {
            if (response.status !== 200) {
              return reject(response.data)
            }
            const state: UserTipState = setupUserTipState()
            this.tips[match] = { tip: response.data.tip as Tip, state }
            this.tips[match].tip.toWin = response.data.tip.toWin || { id: 0 }

            resolve(this.tips[match])
          })
      }), null)
    },
    setTip (match: number, tip: Tip) {
      if (!tip.toWin) {
        tip.toWin = { id: 0 }
      }
      useUserTipStore().tips[match].tip = tip
      return useUserTipStore().tips[match].tip
    },
    getCountryAComputedGoalTip (match: number) {
      return computed({
        get: () => {
          return this.countryAGoalTip(match)
        },
        set: (goals: string | number) => {
          this.setCountryAGoalTip(match, goals)
        }
      })
    },
    getCountryBComputedGoalTip (match: number) {
      return computed({
        get: () => {
          return this.countryBGoalTip(match)
        },
        set: (goals: string | number) => {
          this.setCountryBGoalTip(match, goals)
        }
      })
    },
    getCountryAComputedPenaltyGoalTip (match: number) {
      return computed({
        get: () => {
          return this.countryAPenaltyGoalTip(match)
        },
        set: (goals: string | number) => {
          this.setCountryAPenaltyGoalTip(match, goals)
        }
      })
    },
    getCountryBComputedPenaltyGoalTip (match: number) {
      return computed({
        get: () => {
          return this.countryBPenaltyGoalTip(match)
        },
        set: (goals: string | number) => {
          this.setCountryBPenaltyGoalTip(match, goals)
        }
      })
    },
    getCountryAComputedToWinTip (match: number) {
      return computed({
        get: () => {
          return this.tips[match].tip.toWin.id === this.tips[match].tip.match.countryA.id || this.tips[match].tip.isLevel
        },
        set: (val: boolean) => {
          this.tips[match].tip.toWin = (val) ? this.tips[match].tip.match.countryA : { id: 0 }
        }
      })
    },
    getCountryBComputedToWinTip (match: number) {
      return computed({
        get: () => {
          return this.tips[match].tip.toWin.id === this.tips[match].tip.match.countryB.id || this.tips[match].tip.isLevel
        },
        set: (val: boolean) => {
          this.tips[match].tip.toWin = (val) ? this.tips[match].tip.match.countryB : { id: 0 }
        }
      })
    },
    setCountryAGoalTip (match: number, goals: string | number) {
      if (this.tips[match]) {
        this.tips[match].tip.countryAToScore = goals as number
      }
    },
    setCountryBGoalTip (match: number, goals: string | number) {
      if (this.tips[match]) {
        this.tips[match].tip.countryBToScore = goals as number
      }
    },
    setCountryAPenaltyGoalTip (match: number, goals: string | number) {
      if (this.tips[match]) {
        this.tips[match].tip.countryAPenaltyToScore = goals as number
        this.toggleToPenalty(match)
      }
    },
    setCountryBPenaltyGoalTip (match: number, goals: string | number) {
      if (this.tips[match]) {
        this.tips[match].tip.countryBPenaltyToScore = goals as number
        this.toggleToPenalty(match)
      }
    },
    generateBotEntries (match: number) {
      const maxGoals = 12
      this.tips[match].tip.countryAToScore = Math.floor(Math.random() * maxGoals)
      this.tips[match].tip.countryBToScore = Math.floor(Math.random() * maxGoals)

      this.tips[match].tip.entryByBot = true

      if (this.tips[match].tip.match.round !== MatchRound.GROUP) {
        const equalScore = Math.floor(Math.random() * maxGoals)
        if (equalScore % 2 === 0) {
          this.tips[match].tip.countryAToScore = equalScore
          this.tips[match].tip.countryBToScore = equalScore
        }
        this.tips[match].tip.toPenalty = this.tips[match].tip.countryAToScore === this.tips[match].tip.countryBToScore

        if (this.tips[match].tip.toPenalty) {
          this.tips[match].tip.countryAPenaltyToScore = Math.floor(Math.random() * 8)
          this.tips[match].tip.countryBPenaltyToScore = Math.floor(Math.random() * 8)
        }
      }
    },
    toggleToPenalty (match: number) {
      if (this.tips[match].tip.countryAPenaltyToScore || this.tips[match].tip.countryBPenaltyToScore) {
        this.tips[match].tip.toPenalty = true
      } else if (!this.tips[match].tip.countryAPenaltyToScore && !this.tips[match].tip.countryBPenaltyToScore) {
        this.tips[match].tip.toPenalty = false
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
