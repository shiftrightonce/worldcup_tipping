<template>
  <div class="col-12"
    style="background-image: url('img/bg_3.jpg'); background-size: cover;background-position: center center;overflow: auto;min-height: 500px;">
    <div class="row justify-evenly">
      <div class="col-8 col-xs-12 q-mt-md q-mt-xl">
        <div class="row justify-center">
          <div class="col-md-auto col-xs-12 q-mb-md q-mr-md-md">
            <PrizeCard></PrizeCard>
          </div>
          <div class="col-md-auto col-xs-12 q-mr-md-md q-mb-md">
            <PrizeCard></PrizeCard>
          </div>
          <div class="col-md-auto col-xs-12 q-mb-md">
            <PrizeCard></PrizeCard>
          </div>
          <div class="col-12 lt-md q-mb-xl"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import PrizeCard from 'src/components/general/PrizeCard.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PrizePage',
  components: { PrizeCard }
})
</script>
