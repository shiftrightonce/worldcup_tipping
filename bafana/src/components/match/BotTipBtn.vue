<template>
    <q-btn
      v-if="userTipStore.canBotRun(match.id)"
      flat
      color="secondary"
      round
      icon="shuffle"
      @click="onClick"
    >
    </q-btn>
  <span v-else><!--show nothing--></span>
</template>

<script lang="ts">
import { Match } from 'src/stores/match-store'
import { defineComponent, PropType } from 'vue'
import { useUserTipStore } from 'src/stores/user-tip-store'
export default defineComponent({
  name: 'ToggleBtn',
  props: {
    match: {
      type: Object as PropType<Match>,
      required: true
    }
  },
  setup (props) {
    const userTipStore = useUserTipStore()

    const onClick = () => {
      if (!userTipStore.matchTip(props.match.id).state.expanded) {
        userTipStore.matchTip(props.match.id).state.expanded = !userTipStore.matchTip(props.match.id).state.expanded
      }

      if (userTipStore.matchTip(props.match.id).state.expanded) {
        userTipStore.generateBotEntries(props.match.id)
      }
    }

    return {
      userTipStore,
      onClick
    }
  }
})
</script>
