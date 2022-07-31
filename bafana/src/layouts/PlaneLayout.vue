<template>
  <q-layout view="lHh Lpr lFf">
      <q-header>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          <q-toolbar-title>{{ titleStore.title }}</q-toolbar-title>
          <q-btn flat round dense icon="whatshot" />
        </q-toolbar>
      </q-header>
    <q-page-container>
      <q-page class="q-pa-md">
      <router-view />
        <q-page-sticky  position="bottom-right" :offset="[75, 25]">
          <q-fab icon="keyboard_arrow_up" direction="up" color="primary" >
            <q-fab-action color="primary" icon="mail" label="Mail" />
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
import { defineComponent } from 'vue'
import { useTipLayoutStore } from '../stores/tip-layout-store'

export default defineComponent({
  setup () {
    return {
      titleStore: useTipLayoutStore()
    }
  }
})
</script>
