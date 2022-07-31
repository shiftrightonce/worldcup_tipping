<template>
  <div class="fit row wrap justify-center items-center content-start q-mb-md">
    <div class="col-12 text-center">
      <b>PERNALTY KICK OFF</b><br/>
      <q-checkbox left-label v-model="pernalty" label="" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    return {
      pernalty: ref(false)
    }
  }
})
</script>
