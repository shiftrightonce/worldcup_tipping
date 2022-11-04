<template>
  <transition appear enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">
    <div class="row" ref="board">
      <div class="col-md-4 col-xs-12">
        <div v-if="chatStore.currentRoom && chatStore.messages[chatStore.currentRoom.internalId]">
          <ChatBubble v-for="message in chatStore.messages[chatStore.currentRoom.internalId]" :key="message.internalId"
            :data="message">
          </ChatBubble>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import ChatBubble from 'src/components/chat/ChatBubble.vue'
import { useChatStore } from 'src/stores/chat-store'
import { defineComponent, watch, ref } from 'vue'

export default defineComponent({
  name: 'GroupChatPage',
  setup () {
    const chatStore = useChatStore()
    const board = ref<HTMLDivElement | null>(null)

    // @todo needs more work
    // Suppose to scroll the chat messages to the top
    watch(chatStore.messages, () => {
      board.value?.scrollTo({ top: 0 })
    })

    return {
      chatStore,
      board
    }
  },
  components: { ChatBubble }
})
</script>
