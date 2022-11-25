<template>
  <q-page padding>
    <transition appear enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
      <div>
        <div class="row">
          <div class="col-xs-12 col-md-6 q-mb-md">
            <q-select dense outlined emit-value map-options v-model="status" :options="matchStore.matchStatuses"
              label="Match Status" />
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 col-xs-12" v-for="match in state" :key="match.id" v-show="isReady && (status === null || match.status === status)">
            <AdminMatch :match="match"></AdminMatch>
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
import { defineComponent, ref } from 'vue'
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
    const status = ref<MatchStatus>(MatchStatus.OPEN)

    const { state, isReady } = matchStore.fetchAllMatches(null)

    // watch(() => status.value, async (value) => {
    //   const { execute } = matchStore.fetchAllMatches(value)
    // })

    layoutStore.activeLeftDrawer(false)
    layoutStore.activeRightDrawer(false)
    layoutStore.setTitle('Admin Manage Matches')

    return {
      isReady,
      state,
      status,
      matchStore
    }
  }
})
</script>
