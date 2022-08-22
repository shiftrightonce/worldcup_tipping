<template>
  <div>Admin matches</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useLayoutStore } from '../../stores/layout-store'

export default defineComponent({
  name: 'AdminMatchesPage',
  setup () {
    const layoutStore = useLayoutStore()

    layoutStore.activeLeftDrawer(false)
    layoutStore.setTitle('Admin Manage Matches')

    return {}
  }
})
</script>
