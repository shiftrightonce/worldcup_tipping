<template>
  <q-page padding>
    <transition appear enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">
      <div>
        <CountryCard v-for="country, index in state" :key="country.id" v-model="state[index]"></CountryCard>

      <q-page-scroller expand position="top" :scroll-offset="150" :offset="[0, 0]">
        <ScrollUpMessage></ScrollUpMessage>
      </q-page-scroller>
      </div>
    </transition>
  </q-page>
</template>

<script lang="ts">
import { useCountryStore } from 'src/stores/country-store'
import { useLayoutStore } from 'src/stores/layout-store'
import { defineComponent } from 'vue'
import CountryCard from 'src/components/admin/CountryCard.vue'
import ScrollUpMessage from 'src/components/general/ScrollUpMessage.vue'

export default defineComponent({
  name: 'GroupRoundPointsPage',
  setup () {
    const countryStore = useCountryStore()
    const layoutStore = useLayoutStore()
    const { state, isReady } = countryStore.fetchCountries()
    layoutStore.activeLeftDrawer(false)
    layoutStore.setTitle('Admin Manage Group Points')

    return {
      state,
      isReady
    }
  },
  components: { CountryCard, ScrollUpMessage }
})
</script>
