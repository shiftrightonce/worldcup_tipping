<template>
  <transition
    appear
    enter-active-class="animated backInDown"
    leave-active-class="animated backOutUp"
  >
    <div class="row">
      <div class="col-md-4 col-xs-12" v-for="match in state" :key="match.id">
        <activeTipCard :match="match"></activeTipCard>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { useLayoutStore } from 'src/stores/layout-store'
import { useMatchStore } from 'src/stores/match-store'
import { defineComponent } from 'vue'
import ActiveTipCard from '../components/match/ActiveTipCard.vue'

export default defineComponent({
  name: 'PastMatchesPage',
  setup () {
    const matchStore = useMatchStore()
    const { isReady, state } = matchStore.fetchCompletedMatches()
    useLayoutStore().setTitle('Past Matches')
    return {
      isReady,
      state
    }
  },
  components: { ActiveTipCard }
})
</script>
