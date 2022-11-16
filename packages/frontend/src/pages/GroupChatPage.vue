<template>
  <transition appear enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
    <div class="row">
      <div class="col-md-12 col-xs-12 q-pb-lg">
        <!-- <q-infinite-scroll @load="onLoad" reverse :style="{ height: height }" style="overflow-y:auto" ref="board" -->
        <div  ref="board" v-if="chatStore.currentRoom && chatStore.messages[chatStore.currentRoom.internalId]">
          <q-infinite-scroll @load="onLoad" reverse>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner color="primary" name="dots" size="40px" />
              </div>
            </template>

            <ChatBubble v-for="message in chatStore.messages[chatStore.currentRoom.internalId]"
              :key="message.internalId" :data="message">
            </ChatBubble>
          </q-infinite-scroll>
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
    const heightOffset = 150
    const height = ref(`${window.innerHeight - heightOffset}px`)

    window.addEventListener('resize', () => {
      height.value = `${window.innerHeight - heightOffset}px`
    })

    // @todo needs more work
    // Suppose to scroll the chat messages to the top
    watch(chatStore.messages, () => {
      setTimeout(() => {
        if (board.value) {
          board.value.scrollTop = board.value.scrollHeight + 100
          console.log('ajusted', Date.now())
        }
      }, 500)
    })

    const onLoad = (index: number, done: (b: boolean) => void) => {
      done(true)
    }

    return {
      chatStore,
      board,
      height,
      onLoad
    }
  },
  components: { ChatBubble }
})
</script>
