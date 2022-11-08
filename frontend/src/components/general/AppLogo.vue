<template>
  <q-avatar class="q-mr-md">
    <q-img :src="imgSrc" />
  </q-avatar>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'AppLogo',
  props: {
    imgSrc: {
      type: String as PropType<string>,
      default: 'icons/favicon-128x128.png'
    }
  }
})
</script>
