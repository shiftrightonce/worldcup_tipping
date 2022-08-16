<template>
  <transition
    appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight"
  >
    <div class="row">
      <div class="col-md-4 col-xs-12">
        <div>Group Chat</div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GroupChatPage'
})

</script>
