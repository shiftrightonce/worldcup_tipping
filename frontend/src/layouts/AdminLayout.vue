<template>
  <q-layout view="lHr LpR lFr">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="layoutStore.toggleLeftDrawer"
          v-if="layoutStore.isLeftDrawerEnabled" />

        <q-toolbar-title>
          <AppLogo></AppLogo>
          {{ layoutStore.title }}
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="layoutStore.toggleRighDrawer"
          v-if="layoutStore.isRightDrawerEnabled" />
      </q-toolbar>
    </q-header>

    <!-- <q-drawer show-if-above v-model="layoutStore.leftDrawer" side="left" bordered> -->
      <!-- drawer content -->
    <!-- </q-drawer> -->

    <q-drawer show-if-above v-model="layoutStore.rightDrawer" side="right" bordered>
      <MainMenu></MainMenu>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { useMenuStore } from 'src/stores/menu-store'
import { useUserStore } from 'src/stores/user-store'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '../stores/layout-store'
import MainMenu from '../components/general/MainMenu.vue'
import AppLogo from 'src/components/general/AppLogo.vue'

export default defineComponent({
  name: 'PlaneLayout',
  components: { MainMenu, AppLogo },
  setup () {
    const router = useRouter()
    const userStore = useUserStore()
    const menuStore = useMenuStore()
    const layoutStore = useLayoutStore()

    if (!userStore.isLogin || !userStore.isAdmin) {
      router.push({ name: 'home' })
    } else {
      userStore.setupSocket()
    }

    return {
      layoutStore,
      menuStore,
      userStore
    }
  }
})
</script>
