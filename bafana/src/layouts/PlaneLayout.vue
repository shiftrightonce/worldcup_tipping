<template>
  <q-layout view="lHr lpR lFr">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          {{ layoutStore.title }}
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
     <q-toolbar>
       <q-toolbar-title>Main Menu</q-toolbar-title>
     </q-toolbar>

      <q-list padding class="rounded-borders text-primary">
        <q-item clickable v-ripple v-for="item in menuStore.main" :key="item.label" :to="item.to">
          <q-item-section avatar>
            <q-icon :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section>{{item.label}}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="q-pa-md">
      <router-view />
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
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '../stores/layout-store'

export default defineComponent({
  name: 'PlaneLayout',
  setup () {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)
    const router = useRouter()
    const userStore = useUserStore()
    const menuStore = useMenuStore()

    if (!userStore.isLogin) {
      router.push({ name: 'home' })
    }

    return {
      leftDrawerOpen,
      layoutStore: useLayoutStore(),
      menuStore,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  }
})
</script>
