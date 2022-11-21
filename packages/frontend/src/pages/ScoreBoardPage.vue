<template>
  <q-page padding v-if="state.length && isReady">
    <transition appear enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
      <div class="row">
        <div class="col-md-4 col-xs-12" v-if="myScore">
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
  <q-page v-if="!myScore && isReady && state.length === 0" class="row items-evenly items-center flex-center">
    <div class="col-12" style="text-align:center">
      <img src="/img/first.svg" style="width:200px" /><br/>
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
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const layoutStore = useLayoutStore()
    const userStore = useUserStore()
    const tipStore = useTipStore()
    const { isLoading, isReady, state, execute } = tipStore.fetchScoreboard()
    const myScore = ref<Score | null>(null)
    const router = useRouter()
    let positionCounter = 1
    const positions: {[key:number]: number } = {}

    const q = useQuasar()
    q.loading.show()
    execute().then(() => {
      state.value.forEach((s) => {
        if (!positions[s.totalPoints]) {
          positions[s.totalPoints] = positionCounter++
        }
        s.position = positions[s.totalPoints]
      })
      q.loading.hide()
    }).catch((e) => {
      q.loading.hide()
      if ((e as Error).message.indexOf('401') >= 0) {
        userStore.logout().then(() => {
          router.push({
            name: 'home'
          })
        })
      }
    })

    layoutStore.activeLeftDrawer(false)
    layoutStore.activeRightDrawer(false)
    layoutStore.setTitle('Scoreboard');

    (async () => {
      try {
        myScore.value = await tipStore.fetchMyTotalScore()
        if (!positions[myScore.value.totalPoints]) {
          positions[myScore.value.totalPoints] = positionCounter++
        }
        myScore.value.position = positions[myScore.value.totalPoints]
      } catch (_) {
        // do nothing
      }
    })()

    setTimeout(() => {
      if (Notification.permission !== 'denied' && Notification.permission !== 'granted') {
        q.dialog({
          title: 'Get Notification',
          message: 'Don\'t miss a beat. Get reminder notification🎊',
          cancel: true
        }).onOk(() => {
          userStore.setupNotificationSubscription()
        })
      } else {
        userStore.setupNotificationSubscription()
      }
    }, 2000)

    layoutStore.onAppUpdate(() => {
      q.dialog({
        title: 'New version available',
        message: 'Do you want to update now?',
        cancel: true
      }).onOk(() => {
        document.location.reload()
      })
    })

    return {
      isLoading,
      isReady,
      state,
      myScore
    }
  },
  components: {
    ScrollUpMessage,
    ScoreboardCard
  }
})
</script>
