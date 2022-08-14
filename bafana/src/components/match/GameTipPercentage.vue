<template>
  <q-btn v-if="isMatchCompleted" flat dense round color="green" :label="label"></q-btn>
  <q-btn v-else flat dense round :color="color" :icon="icon" :label="label" ></q-btn>
</template>

<script lang="ts">
import { Match, Tip, MatchStatus } from 'src/stores/match-store'
import { UserTipState } from 'src/stores/user-store'
import { defineComponent, PropType, ref, watch } from 'vue'

export default defineComponent({
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
    const icon = ref('')
    const color = ref('red')
    const isMatchOpen = props.match.status === MatchStatus.OPEN
    const isMatchCompleted = ref(props.match.status === MatchStatus.COMPLETED)
    const label = ref((isMatchCompleted.value) ? props.userTipAndState.tip.points : props.userTipAndState.tip.points || '')

    const setIcon = () => {
      if (isMatchOpen && !props.userTipAndState.tip.isLevel && (!props.userTipAndState.tip.toWin || props.userTipAndState.tip.toWin === null || props.userTipAndState.tip.toWin.id === 0)) {
        icon.value = 'psychology_alt'
      } else if (isMatchOpen && (props.userTipAndState.tip.isLevel || (props.userTipAndState.tip.toWin && props.userTipAndState.tip.toWin.id))) {
        icon.value = 'check_circle'
        color.value = 'green'
      } else if (isMatchOpen && props.userTipAndState.tip.countryAToScore !== props.userTipAndState.tip.countryBToScore) {
        icon.value = 'check_circle'
        color.value = 'green'
      } else if (isMatchOpen && props.userTipAndState.tip.countryAPenaltyToScore !== props.userTipAndState.tip.countryBPenaltyToScore) {
        icon.value = 'check_circle'
        color.value = 'green'
      }
    }

    watch(() => props.userTipAndState.tip, () => {
      setIcon()
    }, { deep: true })

    setIcon()

    return {
      icon,
      color,
      label,
      isMatchCompleted
    }
  }
})

</script>
