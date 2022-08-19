<template>
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
    <q-separator />
    <q-item-label header>Adminstration</q-item-label>
    <q-separator />
    <q-item clickable v-ripple v-for="item in menuStore.user" :key="item.label" :to="item.to">
      <q-item-section avatar>
        <q-icon :name="item.icon"></q-icon>
      </q-item-section>
      <q-item-section>{{item.label}}</q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { useMenuStore } from 'src/stores/menu-store'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MainMenu',
  setup () {
    const menuStore = useMenuStore()

    return {
      menuStore
    }
  }
})
</script>
