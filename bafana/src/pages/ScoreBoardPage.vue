<template>
  <q-page padding v-if="state.length && isReady">
    <transition appear enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">
      <div class="row">
        <div class="col-md-4 col-xs-12">
          <q-list dense bordered separator padding v-if="state.length">
            <q-item v-for="score in state" :key="score.user.id">
              <q-item-section avatar>
                <q-avatar>
                  <q-badge floating :label="getPosition(score.totalPoints)" color="teal" />
                  <img :src="'/static/user/'+ score.user.username + '.png'">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                {{ score.user.username }}
              </q-item-section>
              <q-item-section avatar>
                {{ score.totalPoints }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </transition>
    <q-page-scroller expand position="top" :scroll-offset="150" :offset="[0, 0]">
      <ScrollUpMessage></ScrollUpMessage>
    </q-page-scroller>
  </q-page>
  <q-page v-else class="row items-evenly items-center flex-center">
    <div class="col-12" style="text-align:center">
      <span class="text-h6">Top position is still up for grabs!</span>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useLayoutStore } from 'src/stores/layout-store'
import { useTipStore } from 'src/stores/tip-store'
import { useUserStore } from 'src/stores/user-store'
import { defineComponent } from 'vue'
import ScrollUpMessage from 'src/components/general/ScrollUpMessage.vue'

export default defineComponent({
  setup () {
    const layoutStore = useLayoutStore()
    const userStore = useUserStore()
    const { isLoading, isReady, state } = useTipStore().fetchScoreboard()
    let currentPosition = 1
    const positions: { [key: string]: number } = {}

    layoutStore.activeLeftDrawer(false)
    layoutStore.setTitle('Scoreboard')

    setTimeout(() => {
      userStore.setupNotificationSubscription()
    }, 3000)

    const getPosition = (points: string | number): number => {
      if (positions[points]) {
        return positions[points]
      }
      positions[points] = currentPosition++
      return getPosition(points)
    }

    return {
      isLoading,
      isReady,
      state,
      getPosition
    }
  },
  components: {
    ScrollUpMessage
  }
})
</script>
