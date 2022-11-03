<template>
  <div class="WAL position-relative" :style="style">
    <q-layout view="lHr lpR lFr" container v-if="isReady">
      <q-header elevated>
        <q-toolbar>
          <q-btn round flat icon="menu" class="WAL__drawer-open q-mr-sm" @click="toggleLeftDrawer" />

          <q-btn round flat>
            <q-avatar>
              <img :src="currentConversation.avatar">
            </q-avatar>
          </q-btn>

          <span class="q-subtitle-1 q-pl-md">
            {{ currentConversation.name }}
          </span>

          <q-space />
          <!--
          <q-btn round flat icon="search" />
          <q-btn round flat>
            <q-icon name="attachment" class="rotate-135" />
          </q-btn>
          <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 0]">
              <q-list style="min-width: 150px">
                <q-item clickable>
                  <q-item-section>Contact data</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Block</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Select messages</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Silence</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Clear messages</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Erase messages</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn> -->
          <q-btn flat round dense icon="menu" @click="toggleRightDrawer" />
        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" show-if-above side="left" bordered :breakpoint="690">
        <q-toolbar>
          <q-avatar class="cursor-pointer">
            <ProfileImage></ProfileImage>
          </q-avatar>

          <q-space />

          <!--<q-btn round flat icon="message" />
          <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 8]">
              <q-list style="min-width: 150px">
                <q-item clickable>
                  <q-item-section>New group</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Archived</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Favorites</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn> -->

          <q-btn round flat icon="close" class="WAL__drawer-close" @click="toggleLeftDrawer" />
        </q-toolbar>

        <q-toolbar cllass="bg-grey-2">
          <q-input rounded outlined dense class="WAL__field full-width" v-model="search"
            placeholder="Search or start a new conversation">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-toolbar>

        <q-scroll-area style="height: calc(100% - 100px)">
          <q-list>
            <q-item v-for="(conversation, index) in state" :key="conversation.id" clickable v-ripple
              @click="setCurrentConversation(index)">
              <q-item-section avatar>
                <q-avatar>
                  <img :src="conversation.avatar">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="2">
                  {{ conversation.name }}
                </q-item-label>
                <q-item-label class="conversation__summary" caption>
                  <q-icon name="check" vv-if="conversation.sent" />
                  <!-- <q-icon name="not_interested" v-if="conversation.deleted" /> -->
                  <span style="font-size: 9px">The quick brown fox jumps...</span>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label caption>
                  <!-- <span style="font-size: 9px">{{ conversation.lastMessage?.createdAt.toLocaleString() }}</span> -->
                  <span>2W</span>
                </q-item-label>
                <q-badge rounded color="green" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-drawer show-if-above v-model="rightDrawerOpen" :breakpoint="690" side="right" bordered>
        <MainMenu></MainMenu>
      </q-drawer>

      <q-page-container>
        <q-page class="q-pa-md">
          <router-view />
        </q-page>
      </q-page-container>

      <q-footer>
        <q-toolbar class="bg-grey-6 text-black row">
          <q-btn round flat icon="insert_emoticon" class="q-mr-sm" />
          <q-input rounded outlined dense class="WAL__field col-grow q-mr-sm text-black" :dark="false" bg-color="white"
            v-model="message" placeholder="Type a message" />
          <q-btn round flat icon="send" @click="sendMessage" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { useMenuStore } from 'src/stores/menu-store'
import { useUserStore } from 'src/stores/user-store'
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ProfileImage from '../components/user/ProfileImage.vue'
import MainMenu from '../components/general/MainMenu.vue'
import { useChatStore } from 'src/stores/chat-store'

const conversations = [
  {
    id: 11,
    person: 'General',
    avatar: 'https://cdn.quasar.dev/team/razvan_stoenescu.jpeg',
    caption: 'I\'m working on Quasar!',
    time: '15:00',
    sent: true,
    deleted: true,
    type: 'group'
  },
  {
    id: 1,
    person: 'Razvan Stoenescu',
    avatar: 'https://cdn.quasar.dev/team/razvan_stoenescu.jpeg',
    caption: 'I\'m working on Quasar!',
    time: '15:00',
    sent: true,
    deleted: true
  },
  {
    id: 2,
    person: 'Dan Popescu',
    avatar: 'https://cdn.quasar.dev/team/dan_popescu.jpg',
    caption: 'I\'m working on Quasar!',
    time: '16:00',
    sent: true,
    deleted: false
  },
  {
    id: 3,
    person: 'Jeff Galbraith',
    avatar: 'https://cdn.quasar.dev/team/jeff_galbraith.jpg',
    caption: 'I\'m working on Quasar!',
    time: '18:00',
    sent: true,
    deleted: false
  },
  {
    id: 4,
    person: 'Allan Gaunt',
    avatar: 'https://cdn.quasar.dev/team/allan_gaunt.png',
    caption: 'I\'m working on Quasar!',
    time: '17:00',
    sent: true,
    deleted: false
  }
]

export default defineComponent({
  name: 'GroupChatLayout',
  components: { ProfileImage, MainMenu },
  setup () {
    const $q = useQuasar()

    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)
    const router = useRouter()
    const userStore = useUserStore()
    const menuStore = useMenuStore()

    const search = ref('')
    const message = ref('')
    const currentConversationIndex = ref(0)
    const chatStore = useChatStore()
    const { isReady, state } = chatStore.fetchRooms()

    const currentConversation = computed(() => {
      return state.value[currentConversationIndex.value]
    })

    const style = computed(() => ({
      height: $q.screen.height + 'px'
    }))

    if (!userStore.isLogin) {
      router.push({ name: 'home' })
    } else {
      userStore.setupSocket()
    }

    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    function toggleRightDrawer () {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }

    function setCurrentConversation (index: number) {
      chatStore.currentRoom = state.value[index]
      currentConversationIndex.value = index
    }

    (async () => {
      await chatStore.fetchRooms()
    })()

    const sendMessage = () => {
      if (message.value.trim()) {
        (async () => {
          const response = await chatStore.postMessage(currentConversation.value.internalId, message.value.trim())
          message.value = ''
          console.log('message posted', JSON.stringify(response.data))
        })()
      }
    }

    return {
      isReady,
      state,
      leftDrawerOpen,
      search,
      message,
      currentConversationIndex,
      conversations,
      menuStore,
      rightDrawerOpen,
      style,
      currentConversation,

      setCurrentConversation,
      toggleLeftDrawer,
      toggleRightDrawer,
      sendMessage
    }
  }
})
</script>

<style lang="sass">
.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px

  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
    max-width: 950px
    border-radius: 5px

  &__field.q-field--outlined .q-field__control:before
    border: none

  .q-drawer--standard
    .WAL__drawer-close
      display: none

@media (max-width: 850px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0

@media (min-width: 691px)
  .WAL
    &__drawer-open
      display: none

.conversation__summary
  margin-top: 4px

.conversation__more
  margin-top: 0!important
  font-size: 1.4rem
</style>
