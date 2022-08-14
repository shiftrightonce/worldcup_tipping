<template>
    <q-btn
      v-if="matchIsOpen"
      flat
      color="primary"
      round
      icon="tips_and_updates"
      @click="onClick"
    >
    </q-btn>
  <span v-else><!--show nothing--></span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Match, MatchStatus, Tip } from 'src/stores/match-store'
import { UserTipState, useUserTipStore } from 'src/stores/user-tip-store'

export default defineComponent({
  name: 'TipBtn',
  props: {
    match: {
      type: Object as PropType<Match>,
      required: true
    },
    userTipAndState: {
      type: Object as PropType<{ tip: Tip, state: UserTipState}>,
      required: true
    }
  },
  setup (props) {
    const match = useUserTipStore().matchTip(props.match.id)
    const onClick = () => {
      match.state.expanded = !match.state.expanded
    }

    return {
      onClick,
      matchIsOpen: props.match.status === MatchStatus.OPEN
    }
  }
})
</script>
