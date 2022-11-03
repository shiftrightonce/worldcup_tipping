<template>
  <q-chat-message
    :name="(data.from.id === userStore.user?.id)? 'me' : data.from.username"
    :avatar="data.from.avatar"
    :text="[data.message]"
    :stamp="data.createdAt"
    :sent="data.from.id === userStore.user?.id"
   />
</template>

<script lang="ts">
import { ChatMessage } from 'src/stores/chat-store'
import { useUserStore } from 'src/stores/user-store'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ChatBubble',
  props: {
    data: {
      type: Object as PropType<ChatMessage>,
      required: true
    },
    from: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  setup () {
    const userStore = useUserStore()

    return {
      userStore
    }
  }
})
</script>
