<template>
  <q-avatar class="q-mr-md" :size="size" >
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
    },
    size: {
      type: String as PropType<string>,
      default: '38px'
    }
  }
})
</script>
