<template>
  <q-page padding>
    <transition appear enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
      <div class="row">
        <div class="col-md-2 col-xs-12">
          <q-card>
            <q-card-section>
              <div class="text-h6">User Count</div>
              <div class="text-subtitle2 text-secondary">{{ totalUsers }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-2 col-xs-12 q-ml-md-sm q-mt-xs-sm q-mt-md-none">
          <q-card>
            <q-card-section>
              <div class="text-h6">Total Tips</div>
              <div class="text-subtitle2 text-secondary">{{ totalTips }}</div>
            </q-card-section>
          </q-card>
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
import ScrollUpMessage from 'src/components/general/ScrollUpMessage.vue'
import { useAdminStore } from 'src/stores/admin-store'

export default defineComponent({
  name: 'AdminUsersPage',
  setup () {
    const layoutStore = useLayoutStore()
    const adminStore = useAdminStore()
    const totalUsers = ref(0)
    const totalTips = ref(0)

    layoutStore.activeLeftDrawer(false)
    layoutStore.setTitle('Statistics');
    (async () => {
      try {
        totalUsers.value = (await adminStore.totalUserCount() as { data: { count: number } }).data.count
        totalTips.value = (await adminStore.totalTipCount() as { data: { count: number } }).data.count
      } catch (e) {
        // @todo Handle error
      }
    })()

    return {
      totalUsers,
      totalTips
    }
  },
  components: {
    ScrollUpMessage
  }
})
</script>
