<template>
  <transition appear enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">
    <div class="row">
      <div class="col-md-4 col-xs-12">
        <div>Group Chat</div>
        <div v-if="chatStore.currentRoom && chatStore.messages[chatStore.currentRoom.internalId]">
          <ChatBubble v-for="message in chatStore.messages[chatStore.currentRoom.internalId]" :key="message.internalId"
            :data="message"></ChatBubble>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import ChatBubble from 'src/components/chat/ChatBubble.vue'
import { useChatStore } from 'src/stores/chat-store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GroupChatPage',
  setup () {
    const chatStore = useChatStore()
    return {
      chatStore
    }
  },
  components: { ChatBubble }
})
</script>
