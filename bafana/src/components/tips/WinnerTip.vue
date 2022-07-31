<template>
  <div class="fit row wrap justify-center items-center content-start">
    <div class="col-12 text-center"><b>WINNER</b></div>
  </div>
  <div class="fit row wrap justify-center items-center content-start q-mb-md">
  <div class="col text-center">
    <q-radio v-model="winner" val="a" label="A" />
  </div>
    <div class="col text-center">V.</div>
    <div class="col text-center">
      <q-radio v-model="winner" val="b" label="B" />
    </div>
</div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'PernaltyGoalsTip',
  setup () {
    return {
      winner: ref('')
    }
  }
})
</script>
