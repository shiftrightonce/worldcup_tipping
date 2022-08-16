<template>
  <q-layout view="lHr lpR lFr">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="layoutStore.toggleLeftDrawer" v-if="layoutStore.isLeftDrawerEnabled" />

        <q-toolbar-title>
          <q-avatar>
            <ProfileImage></ProfileImage>
          </q-avatar>
          {{ layoutStore.title }}
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="layoutStore.toggleRighDrawer" v-if="layoutStore.isRightDrawerEnabled" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="layoutStore.leftDrawer"  v-if="layoutStore.isLeftDrawerEnabled"  side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-drawer show-if-above v-model="layoutStore.rightDrawer" v-if="layoutStore.isRightDrawerEnabled"  side="right" bordered>
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
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '../stores/layout-store'
import ProfileImage from '../components/user/ProfileImage.vue'

export default defineComponent({
  name: 'PlaneLayout',
  components: { ProfileImage },
  setup () {
    const router = useRouter()
    const userStore = useUserStore()
    const menuStore = useMenuStore()
    const layoutStore = useLayoutStore()

    if (!userStore.isLogin) {
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
