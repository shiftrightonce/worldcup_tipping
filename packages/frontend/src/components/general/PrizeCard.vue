<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
      <div class="text-h6">{{ prize.title }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-img :src="prize.image" />
    </q-card-section>

    <q-separator inset v-if="prize.description" />

    <q-card-section v-if="prize.description">
      {{ prize.description }}
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'PrizeCard',
  props: {
    prize: {
      type: Object as PropType<{ image: string, title: string, position: number, description: string }>,
      required: true
    }
  }
})
</script>

<style scoped>
/* .my-card {
  width: 100%;
  max-width: 250px
} */
</style>
