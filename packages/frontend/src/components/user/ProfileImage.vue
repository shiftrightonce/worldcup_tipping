<template>
  <q-img v-if="userStore.user" :src="userStore.user.avatar" :width="width" :height="height">
  </q-img>
</template>

<script lang="ts">
import { useUserStore } from 'src/stores/user-store'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'UserProfileImage',
  props: {
    width: {
      type: String as PropType<string>,
      default: '38px'
    },
    height: {
      type: String as PropType<string>,
      default: '38px'
    }
  },
  setup () {
    return {
      userStore: useUserStore()
    }
  }
})
</script>
