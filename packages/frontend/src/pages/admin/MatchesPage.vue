<template>
  <q-page padding>
    <transition appear enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
      <div>
      <div class="row">
        <div class="col-xs-12">
          <div></div>
        </div>
        </div>
      <div class="row">
        <div class="col-md-4 col-xs-12" v-for="match in state" :key="match.id" v-show="isReady">
          <AdminMatch  :match="match"></AdminMatch>
        </div>
      </div>
    </div>
    </transition>
    <q-page-scroller expand position="top" :scroll-offset="150" :offset="[0, 0]">
      <ScrollUpMessage></ScrollUpMessage>
    </q-page-scroller>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useLayoutStore } from '../../stores/layout-store'
import { MatchStatus, useMatchStore } from '../../stores/match-store'
import AdminMatch from 'src/components/admin/AdminMatch.vue'
import ScrollUpMessage from 'src/components/general/ScrollUpMessage.vue'

export default defineComponent({
  name: 'AdminMatchesPage',
  components: { AdminMatch, ScrollUpMessage },
  setup () {
    const layoutStore = useLayoutStore()
    const matchStore = useMatchStore()
    const status = ref<MatchStatus | null>(null)

    let { state, isReady } = matchStore.fetchAllMatches(status.value)

    watch(() => status.value, (value) => {
      ({ state, isReady } = matchStore.fetchAllMatches(value))
    })

    layoutStore.activeLeftDrawer(false)
    layoutStore.setTitle('Admin Manage Matches')

    return {
      isReady,
      state
    }
  }
})
</script>
