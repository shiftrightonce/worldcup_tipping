import { defineStore } from 'pinia'

const APP_VERSION = '0.0.1'

export const useLayoutStore = defineStore('layoutTitle', {
  state: () => ({
    layoutTitle: 'Active Tips',
    version: APP_VERSION
  }),
  getters: {
    title: (state) => state.layoutTitle,
    appVersion: (state) => state.version
  },
  actions: {
    setTitle (title: string) {
      this.layoutTitle = title
    }
  }
})
