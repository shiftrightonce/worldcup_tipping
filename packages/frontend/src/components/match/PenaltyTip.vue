<template>
  <div class="fit row wrap justify-center items-center content-start q-mb-md" v-if="isNotGroupRound">
    <div class="col-12 text-center">
      <b>PENALTY KICK OFF</b>&nbsp;<q-badge rounded transparent color="green" v-if="isMatchCompleted && match.penalty" /><br/>
      <q-checkbox  left-label v-model="matchTip.tip.toPenalty"  label="" :disable="!isMatchOpen" />
    </div>
  </div>
  <span><!-- show nothing --></span>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { Match, Tip, MatchRound, MatchStatus } from 'src/stores/match-store'
import { UserTipState } from 'src/stores/user-store'
import { useUserTipStore } from 'src/stores/user-tip-store'

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
    const isMatchOpen = props.match.status === MatchStatus.OPEN
    const isNotGroupRound = props.match.round !== MatchRound.GROUP
    const isMatchCompleted = ref(props.match.status === MatchStatus.COMPLETED)
    const matchTip = useUserTipStore().matchTip(props.match.id)

    return {
      matchTip,
      isMatchOpen,
      isNotGroupRound,
      isMatchCompleted
    }
  }
})
</script>
