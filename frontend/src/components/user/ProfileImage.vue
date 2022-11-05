<template>
  <q-img v-if="userStore.user" :src="userStore.user.avatar">
  </q-img>
</template>

<script lang="ts">
import { useUserStore } from 'src/stores/user-store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserProfileImage',
  setup () {
    return {
      userStore: useUserStore()
    }
  }
})
</script>
