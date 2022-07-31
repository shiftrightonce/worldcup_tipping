import { defineStore } from 'pinia'

export const useTipLayoutStore = defineStore('tipLayoutTitle', {
  state: () => ({
    layoutTitle: 'Active Tips'
  }),
  getters: {
    title: (state) => state.layoutTitle
  },
  actions: {
    setTitle (title: string) {
      this.layoutTitle = title
    }
  }
})
