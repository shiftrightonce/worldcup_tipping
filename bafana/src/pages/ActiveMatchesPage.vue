<template>
    <!-- card-->
    <transition
  appear
  enter-active-class="animated backInDown"
  leave-active-class="animated backOutUp"
>
    <div class="row"
    >
      <div class="col-md-4 col-xs-12" v-for="match in matchStore.today" :key="match.id">
        <ActiveTipCard :match="match"></ActiveTipCard>
      </div>
    </div>
    </transition>
    <!--// card-->

</template>

<script lang="ts">
import { useMatchStore } from 'src/stores/match-store'
import { defineComponent } from 'vue'
import ActiveTipCard from '../components/match/ActiveTipCard.vue'

export default defineComponent({
  setup () {
    const matchStore = useMatchStore();
    (async () => {
      await matchStore.getTodayMatches()
    })()
    return {
      matchStore
    }
  },
  components: { ActiveTipCard }
})
</script>
