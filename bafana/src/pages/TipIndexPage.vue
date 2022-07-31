<template>
    <!-- card-->
    <div class="row">
      <div class="col-md-4 col-sm-12" v-for="id in tipStore.today" :key="id">
        <ActiveTipCard></ActiveTipCard>
      </div>
    </div>
    <!--// card-->

</template>

<script lang="ts">
import { useTipStore } from 'src/stores/tip-store'
import { defineComponent } from 'vue'
import ActiveTipCard from '../components/ActiveTipCard.vue'

export default defineComponent({
  setup () {
    const tipStore = useTipStore()
    return {
      tipStore
    }
  },
  components: { ActiveTipCard }
})
</script>
