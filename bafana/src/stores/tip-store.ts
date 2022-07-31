import { defineStore } from 'pinia'

export const useTipStore = defineStore('tipStore', {
  state: () => ({
    activeTips: [] as number[]
  }),
  getters: {
    today: (state) => state.activeTips.length ? state.activeTips : [1, 2, 3, 4]
  },
  actions: {
    setTodayTips (tips: number[]) {
      this.activeTips = tips
    }
  }
})
