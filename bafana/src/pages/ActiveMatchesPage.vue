<template>
  <q-page padding>
    <transition appear enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">
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

export default defineComponent({
  setup () {
    const matchStore = useMatchStore()
    const layoutStore = useLayoutStore();

    (async () => {
      await matchStore.getTodayMatches()
    })()

    layoutStore.activeLeftDrawer(false)
    layoutStore.setTitle('Active Matches')

    return {
      matchStore
    }
  },
  components: { ActiveTipCard, ScrollUpMessage }
})
</script>
