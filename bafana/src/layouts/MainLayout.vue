<template>
  <q-layout>
    <q-header>
      <q-toolbar>
        <q-toolbar-title>
          {{ layoutStore.title }}
        </q-toolbar-title>

        <div>v0.0.1</div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useLayoutStore } from '../stores/layout-store'

export default defineComponent({
  name: 'MainLayout',

  components: {
  },
  setup () {
    const layoutStore = useLayoutStore()

    layoutStore.setTitle('Home')

    return {
      layoutStore
    }
  }
})
</script>
