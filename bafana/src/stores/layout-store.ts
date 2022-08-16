import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const APP_VERSION = '0.0.1'

export const useLayoutStore = defineStore('layoutTitle', {
  state: () => ({
    layoutTitle: 'Active Tips',
    version: APP_VERSION,
    leftDrawer: ref(true),
    rightDrawer: ref(true),
    enableLeftDrawer: ref(true),
    enableRightDrawer: ref(true)
  }),
  getters: {
    title: (state) => state.layoutTitle,
    appVersion: (state) => state.version,
    isLeftDrawerEnabled: (state) => state.enableLeftDrawer,
    isRightDrawerEnabled: (state) => state.enableRightDrawer
  },
  actions: {
    setTitle (title: string) {
      this.layoutTitle = title
    },
    activeLeftDrawer (enable = true) {
      this.enableLeftDrawer = enable
      this.leftDrawer = enable
    },
    activeRightDrawer (enable = true) {
      this.enableRightDrawer = enable
      this.rightDrawer = enable
    },
    toggleLeftDrawer () {
      if (this.isLeftDrawerEnabled) {
        this.leftDrawer = !this.leftDrawer
      }
    },
    toggleRighDrawer () {
      if (this.isRightDrawerEnabled) {
        this.rightDrawer = !this.rightDrawer
      }
    },
    leftDrawerComputed () {
      return computed(() => this.leftDrawer)
    }
  }
})
