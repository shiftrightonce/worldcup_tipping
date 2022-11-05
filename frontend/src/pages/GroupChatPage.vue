<template>
  <transition appear enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">
    <div class="row">
      <div class="col-md-12 col-xs-12">
        <q-scroll-area :style="{ height: height, maxHeight: height }" ref="board">
          Hello
          <div v-if="chatStore.currentRoom && chatStore.messages[chatStore.currentRoom.internalId]">
            <ChatBubble v-for="message in chatStore.messages[chatStore.currentRoom.internalId]"
              :key="message.internalId" :data="message">
            </ChatBubble>
          </div>
        </q-scroll-area>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { QScrollArea } from 'quasar'
import ChatBubble from 'src/components/chat/ChatBubble.vue'
import { useChatStore } from 'src/stores/chat-store'
import { defineComponent, watch, ref } from 'vue'

export default defineComponent({
  name: 'GroupChatPage',
  setup () {
    const chatStore = useChatStore()
    const board = ref<QScrollArea | null>(null)
    const heightOffset = 150
    const height = ref(`${window.innerHeight - heightOffset}px`)

    console.log('height', height.value)

    window.addEventListener('resize', () => {
      height.value = `${window.innerHeight - heightOffset}px`
      console.log('height', height.value)
    })

    // @todo needs more work
    // Suppose to scroll the chat messages to the top
    watch(chatStore.messages, () => {
      if (board.value) {
        console.log('scrolling....', Date.now())
        board.value.setScrollPercentage('vertical', 1.0)
        board.value.setScrollPercentage('vertical', 1.0)
      }
      // board.value?.scrollTo = board.value?.scrollHeight + 100
    })

    return {
      chatStore,
      board,
      height
    }
  },
  components: { ChatBubble }
})
</script>
