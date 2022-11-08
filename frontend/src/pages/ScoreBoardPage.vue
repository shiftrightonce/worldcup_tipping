<template>
  <q-page padding v-if="state.length && isReady">
    <transition appear enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
      <div class="row">
        <div class="col-md-4 col-xs-12">
          <ScoreboardCard v-if="myScore" current-user :score="myScore"></ScoreboardCard>
        </div>
        <div class="col-md-4 col-xs-12" v-for="score in state" :key="score.user.internalId">
          <ScoreboardCard :score="score"></ScoreboardCard>
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
import { useTipStore, Score } from 'src/stores/tip-store'
import { useUserStore } from 'src/stores/user-store'
import { defineComponent, ref } from 'vue'
import ScrollUpMessage from 'src/components/general/ScrollUpMessage.vue'
import ScoreboardCard from 'src/components/general/ScoreboardCard.vue'

export default defineComponent({
  setup () {
    const layoutStore = useLayoutStore()
    const userStore = useUserStore()
    const tipStore = useTipStore()
    const { isLoading, isReady, state } = tipStore.fetchScoreboard()
    const myScore = ref<Score | null>(null)
    let currentPosition = 1
    const positions: { [key: string]: number } = {}

    layoutStore.activeLeftDrawer(false)
    layoutStore.setTitle('Scoreboard');

    (async () => {
      myScore.value = await tipStore.fetchMyTotalScore()
      console.log('my score', { ...myScore.value })
    })()

    setTimeout(() => {
      userStore.setupNotificationSubscription()
    }, 2000)

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
      myScore,
      getPosition
    }
  },
  components: {
    ScrollUpMessage,
    ScoreboardCard
  }
})
</script>
