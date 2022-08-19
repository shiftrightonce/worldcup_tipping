<template>
    <transition
      appear
      enter-active-class="animated slideInLeft"
      leave-active-class="animated slideOutRight"
    >
      <div class="row">
        <div class="col-md-4 col-xs-12" v-for="match in matchStore.today" :key="match.id">
          <ActiveTipCard :match="match"></ActiveTipCard>
        </div>
      </div>
    </transition>
</template>

<script lang="ts">
import { useMatchStore } from 'src/stores/match-store'
import { defineComponent } from 'vue'
import ActiveTipCard from '../components/match/ActiveTipCard.vue'
import { useLayoutStore } from '../stores/layout-store'

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
  components: { ActiveTipCard }
})
</script>
