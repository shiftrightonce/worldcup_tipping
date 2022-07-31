<template>
  <div class="fit row wrap justify-center items-center content-start">
    <div class="col text-center">
      A<br/>
      <q-img :src="aImage" width="60%" /><br/>
      <strong>{{ aLabel }}</strong>
    </div>
    <div class="col-1 text-center">
      <span>V.</span>
      </div>
    <div class="col text-center">
      B<br/>
      <q-img :src="bImage" width="60%" /><br/>
      <strong>{{ bLabel }}</strong>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'VersesImage',
  props: {
    aImage: {
      required: true,
      type: String as PropType<string>
    },
    aLabel: {
      required: true,
      type: String as PropType<string>
    },
    bImage: {
      required: true,
      type: String as PropType<string>
    },
    bLabel: {
      required: true,
      type: String as PropType<string>
    }
  }
})
</script>
