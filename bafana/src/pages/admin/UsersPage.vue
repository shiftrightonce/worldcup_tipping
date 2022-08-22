<template>
  <div>Users</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useLayoutStore } from '../../stores/layout-store'

export default defineComponent({
  name: 'AdminUsersPage',
  setup () {
    const layoutStore = useLayoutStore()

    layoutStore.activeLeftDrawer(false)
    layoutStore.setTitle('Admin Manage Users')

    return {}
  }
})
</script>
