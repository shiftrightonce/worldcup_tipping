<template>
  <q-page padding>
    <transition appear enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
      <div class="row">
        <div class="col-md-4 col-xs-12" v-for="match in matchStore.today" :key="match.id">
          <ActiveTipCard :match="match"></ActiveTipCard>
        </div>
      </div>
    </transition>
    <q-page-scroller expand position="top" :scroll-offset="150" :offset="[0, 0]">
      <ScrollUpMessage></ScrollUpMessage>
    </q-page-scroller>
  </q-page>
</template>

<script lang="ts">
import { useMatchStore } from 'src/stores/match-store'
import { defineComponent } from 'vue'
import ActiveTipCard from '../components/match/ActiveTipCard.vue'
import { useLayoutStore } from '../stores/layout-store'
import ScrollUpMessage from 'src/components/general/ScrollUpMessage.vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const matchStore = useMatchStore()
    const layoutStore = useLayoutStore()
    const userStore = useUserStore()
    const q = useQuasar()
    const router = useRouter()

    q.loading.show()
    setTimeout(() => {
      (async () => {
        try {
          await matchStore.getTodayMatches()
          q.loading.hide()
        } catch (e) {
          q.loading.hide()
          if ((e as Error).message.indexOf('401') >= 0) {
            void await userStore.logout()
            router.push({
              name: 'home'
            })
          }
        }
      })()
    }, 0)

    layoutStore.activeLeftDrawer(false)
    layoutStore.activeRightDrawer(false)
    layoutStore.setTitle('Active Matches')

    return {
      matchStore
    }
  },
  components: { ActiveTipCard, ScrollUpMessage }
})
</script>
