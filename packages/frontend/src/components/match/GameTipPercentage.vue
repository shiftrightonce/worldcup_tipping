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
    const isMatchCompleted = ref(props.match.status === MatchStatus.COMPLETED)
    const label = ref((isMatchCompleted.value) ? props.userTipAndState.tip.points : props.userTipAndState.tip.points || '')

    const setIcon = () => {
      if (props.userTipAndState.tip.id) {
        color.value = 'green'
        icon.value = 'check_circle'
      } else {
        icon.value = 'psychology_alt'
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
