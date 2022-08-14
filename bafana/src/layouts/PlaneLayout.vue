<template>
  <q-layout view="lHh Lpr lFf">
      <q-header>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          <q-toolbar-title>{{ layoutStore.title }}</q-toolbar-title>
          <q-btn flat round dense icon="manage_accounts" />
        </q-toolbar>
      </q-header>
    <q-page-container>
      <q-page class="q-pa-md">
      <router-view />
        <q-page-sticky  position="bottom-right" :offset="[160, 25]">
          <q-fab icon="menu" direction="up" color="red" vertical-actions-align="left" >
            <q-fab-action v-for="(item, index) in menuStore.main" :key="index"  :color="item.color" :icon="item.icon" :label="item.label" :to="item.to" />
          </q-fab>
        </q-page-sticky>
        <q-page-scroller expand position="top" :scroll-offset="150" :offset="[0, 0]">
            <div class="col cursor-pointer q-pa-sm bg-accent text-white text-center">
              Scroll back up...
            </div>
        </q-page-scroller>
       </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useMenuStore } from 'src/stores/menu-store'
import { useUserStore } from 'src/stores/user-store'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '../stores/layout-store'

export default defineComponent({
  setup () {
    const router = useRouter()
    const userStore = useUserStore()
    const menuStore = useMenuStore()

    if (!userStore.isLogin) {
      router.push({ name: 'home' })
    }

    return {
      layoutStore: useLayoutStore(),
      menuStore
    }
  }
})
</script>
