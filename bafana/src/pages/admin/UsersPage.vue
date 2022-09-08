<template>
  <q-page padding>
    <div>Users</div>
    <q-page-scroller expand position="top" :scroll-offset="150" :offset="[0, 0]">
      <ScrollUpMessage></ScrollUpMessage>
    </q-page-scroller>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useLayoutStore } from '../../stores/layout-store'
import ScrollUpMessage from 'src/components/general/ScrollUpMessage.vue'

export default defineComponent({
  name: 'AdminUsersPage',
  setup () {
    const layoutStore = useLayoutStore()

    layoutStore.activeLeftDrawer(false)
    layoutStore.setTitle('Admin Manage Users')

    return {}
  },
  components: {
    ScrollUpMessage
  }
})
</script>
