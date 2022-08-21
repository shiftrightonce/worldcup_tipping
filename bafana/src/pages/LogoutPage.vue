<template>
  <div class="row">
  <div class="col-md-4 col-xs-12" v-for="i in count" :key="i">
    <h4>Hello world</h4>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TestPage',
  setup () {
    return {
      count: 300
    }
  }
})
</script>
