<template>
  <div class="col cursor-pointer q-pa-sm bg-accent text-white text-center">
    {{ message }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  title: 'ScrollUpMessage',
  props: {
    message: {
      type: String as PropType<string>,
      default: 'Scroll back up'
    }
  },
  setup () {
    return {}
  }
})
</script>
